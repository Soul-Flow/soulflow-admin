import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { create } from "zustand";

import { getApiBaseUrl } from "@/lib/api";

function playNotificationChime() {
	if (typeof window === "undefined") return;
	try {
		const AudioContextClass =
			window.AudioContext ||
			// biome-ignore lint/suspicious/noExplicitAny: audio fallback
			(window as any).webkitAudioContext;
		if (!AudioContextClass) return;
		const ctx = new AudioContextClass();
		if (ctx.state === "suspended") {
			ctx.resume();
		}
		const now = ctx.currentTime;

		const notes = [
			{ freq: 523.25, time: 0, dur: 0.25, vol: 0.25 }, // C5
			{ freq: 659.25, time: 0.1, dur: 0.25, vol: 0.3 }, // E5
			{ freq: 783.99, time: 0.2, dur: 0.3, vol: 0.35 }, // G5
			{ freq: 1046.5, time: 0.32, dur: 0.6, vol: 0.4 }, // C6
		];

		notes.forEach(({ freq, time, dur, vol }) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + time);
			gain.gain.setValueAtTime(0.001, now + time);
			gain.gain.linearRampToValueAtTime(vol, now + time + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + time);
			osc.stop(now + time + dur);
		});
	} catch {
		// Ignore browser audio restrictions if user hasn't interacted
	}
}

// Track recently processed notifications to avoid notification loops
const recentNotificationKeys = new Set<string>();

export interface NotificationMessage {
	type: "LOW_STOCK" | "ORDER_PAID" | "NEW_ORDER" | "CUSTOM_ORDER" | string;
	title: string;
	message: string;
	referenceId?: string;
	timestamp?: string;
	status?: string;
}

interface NotificationState {
	notifications: NotificationMessage[];
	unreadCount: number;
	client: Client | null;
	connect: () => void;
	disconnect: () => void;
	markAllAsRead: () => void;
	addNotification: (notification: NotificationMessage) => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
	notifications: [],
	unreadCount: 0,
	client: null,

	connect: () => {
		// Only connect if not already connected
		if (get().client?.connected || get().client?.active) return;

		if (typeof window !== "undefined" && "Notification" in window) {
			if (Notification.permission === "default") {
				Notification.requestPermission();
			}
		}

		const token =
			typeof window !== "undefined"
				? localStorage.getItem("admin_token")
				: null;

		const baseUrl = getApiBaseUrl();

		const client = new Client({
			// Using SockJS wrapper instead of native brokerURL
			webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
			connectHeaders: {
				Authorization: token ? `Bearer ${token}` : "",
			},
			debug: (msg) => console.log("STOMP Debug:", msg),
			onConnect: (frame) => {
				console.log("Connected to STOMP:", frame);

				client.subscribe("/topic/admin.notifications", (message) => {
					console.log("Received STOMP message payload:", message.body);
					if (message.body) {
						try {
							const notif: NotificationMessage = JSON.parse(message.body);
							get().addNotification(notif);
						} catch (error) {
							console.error("Failed to parse STOMP message:", error);
						}
					}
				});
			},
			onStompError: (frame) => {
				console.error(`Broker reported error: ${frame.headers.message}`);
				console.error(`Additional details: ${frame.body}`);
			},
			onWebSocketError: (error) => {
				console.error("WebSocket Error:", error);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.activate();
		set({ client });
	},

	disconnect: () => {
		const client = get().client;
		if (client) {
			client.deactivate();
			set({ client: null });
		}
	},

	addNotification: (notification) => {
		// Dedup key to avoid duplicate/loop notifications within brief time window
		const dedupKey = `${notification.type}_${notification.referenceId || ""}_${notification.timestamp || ""}_${notification.title}`;
		if (recentNotificationKeys.has(dedupKey)) {
			return;
		}
		recentNotificationKeys.add(dedupKey);
		setTimeout(() => {
			recentNotificationKeys.delete(dedupKey);
		}, 6000);

		set((state) => ({
			notifications: [notification, ...state.notifications],
			unreadCount: state.unreadCount + 1,
		}));

		// Play sound chime for orders and important events
		if (
			notification.type === "ORDER_PAID" ||
			notification.type === "NEW_ORDER" ||
			notification.type === "CUSTOM_ORDER"
		) {
			playNotificationChime();
		}

		if (notification.type === "ORDER_PAID" || notification.type === "NEW_ORDER") {
			toast.success(notification.title, {
				description: notification.message,
			});
		} else if (notification.type === "CUSTOM_ORDER") {
			toast.info(notification.title, {
				description: notification.message,
			});
		} else if (notification.type === "LOW_STOCK") {
			toast.warning(notification.title, {
				description: notification.message,
			});
		} else {
			toast.info(notification.title, {
				description: notification.message,
			});
		}

		// OS-level desktop notification
		if (
			typeof window !== "undefined" &&
			"Notification" in window &&
			Notification.permission === "granted"
		) {
			new Notification(notification.title, {
				body: notification.message,
				icon: "/favicon.ico",
			});
		}
	},

	markAllAsRead: () => {
		set({ unreadCount: 0 });
	},
}));

export default useNotificationStore;
