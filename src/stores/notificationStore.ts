import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { create } from "zustand";

export interface NotificationMessage {
	type: "LOW_STOCK" | "ORDER_PAID";
	title: string;
	message: string;
	referenceId: string;
	timestamp: string;
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

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
		set((state) => ({
			notifications: [notification, ...state.notifications],
			unreadCount: state.unreadCount + 1,
		}));

		if (notification.type === "ORDER_PAID") {
			toast.success(notification.title, {
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
				icon: "/favicon.ico", // Optional: provide a path to a real icon if available
			});
		}
	},

	markAllAsRead: () => {
		set({ unreadCount: 0 });
	},
}));

export default useNotificationStore;
