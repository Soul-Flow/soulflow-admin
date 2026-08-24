"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SortOrder } from "@/enums/sort-order.enum";
import ghnData from "@/lib/data/ghn-locations.json";
import { accountService } from "@/services/accountService";
import { shippingService } from "@/services/shippingService";
import useOrderStore from "@/stores/orderStore";
import useProductStore from "@/stores/productStore";

const formSchema = z.object({
	username: z.string().min(1, "Vui lòng nhập Username để tìm kiếm"),
	accountPk: z.number().min(1, "Vui lòng tìm và chọn khách hàng"),
	fullname: z.string().min(1, "Vui lòng nhập tên khách hàng"),
	phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
	addressDetail: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết"),
	provinceId: z.number().min(1, "Vui lòng chọn Tỉnh/Thành"),
	districtId: z.number().min(1, "Vui lòng chọn Quận/Huyện"),
	wardCode: z.string().min(1, "Vui lòng chọn Phường/Xã"),
	price: z.number().min(0, "Giá trị đơn hàng không hợp lệ"),
	shippingFee: z.number().min(0, "Phí ship không hợp lệ"),
	paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCustomOrderDialog({
	onCreated,
	trigger,
	initialUsername,
	initialPrice,
}: {
	onCreated?: () => void;
	trigger?: React.ReactNode;
	initialUsername?: string;
	initialPrice?: number;
}) {
	const [open, setOpen] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [isCalculatingFee, setIsCalculatingFee] = useState(false);
	const [customProductPk, setCustomProductPk] = useState<number>(999);
	const { createCustomOrder } = useOrderStore();
	const { filter: filterProducts } = useProductStore();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			accountPk: 0,
			fullname: "",
			phone: "",
			addressDetail: "",
			provinceId: 0,
			districtId: 0,
			wardCode: "",
			price: 0,
			shippingFee: 0,
			paymentMethod: "COD",
		},
	});

	const watchUsername = watch("username");
	const watchProvinceId = watch("provinceId");
	const watchDistrictId = watch("districtId");
	const watchWardCode = watch("wardCode");
	const watchPaymentMethod = watch("paymentMethod");

	// Location data processing
	const provinces = ghnData as any[];
	const districts =
		provinces.find((p) => p.id === watchProvinceId)?.districts || [];
	const wards =
		districts.find((d: any) => d.id === watchDistrictId)?.wards || [];

	useEffect(() => {
		if (open) {
			filterProducts({
				keyword: null,
				minPrice: null,
				maxPrice: null,
				fromDate: null,
				toDate: null,
				categoryPk: null,
				available: true,
				deleted: false,
				sortOrder: SortOrder.DESC,
				pageNumber: 0,
				pageSize: 100,
			})
				.then((page) => {
					if (page?.content) {
						// Fallback: try to find custom product, or use the first available product
						const customProduct = page.content.find(
							(p: any) =>
								String(p.customised) === "true" ||
								p.nameVn.toLowerCase().includes("custom") ||
								p.nameEng.toLowerCase().includes("custom"),
						);
						if (customProduct) {
							setCustomProductPk(Number(customProduct.pk));
						} else if (page.content.length > 0) {
							setCustomProductPk(Number(page.content[0].pk));
						}
					}
				})
				.catch((err) =>
					console.error("Failed to fetch products for custom order:", err),
				);
		}
	}, [open, filterProducts]);

	// Auto calculate shipping fee when ward changes
	useEffect(() => {
		if (watchDistrictId && watchWardCode) {
			const calculateFee = async () => {
				setIsCalculatingFee(true);
				try {
					const res = await shippingService.calculateFee(
						watchDistrictId,
						watchWardCode,
					);
					setValue("shippingFee", res.total || 0);
				} catch (error) {
					console.error("Failed to calculate shipping fee:", error);
					toast.error(
						"Không thể tính phí vận chuyển tự động. Vui lòng tự nhập.",
					);
				} finally {
					setIsCalculatingFee(false);
				}
			};
			void calculateFee();
		}
	}, [watchDistrictId, watchWardCode, setValue]);

	const handleSearchUser = async (usernameToSearch?: string) => {
		const targetUsername = usernameToSearch || watchUsername;
		if (!targetUsername) {
			toast.error("Vui lòng nhập Username để tìm kiếm");
			return;
		}
		setIsSearching(true);
		try {
			const account = await accountService.findByUsername(targetUsername);
			setValue("username", targetUsername);
			setValue("accountPk", Number(account.pk));
			setValue("fullname", account.fullname || "");
			setValue("phone", account.phone || "");

			let matchedProvinceId = 0;
			let matchedDistrictId = 0;
			let matchedWardCode = "";
			let addressDetail = account.address || "";

			if (account.address) {
				const normalizeLoc = (str: string) => {
					if (!str) return "";
					return str
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D")
						.toLowerCase()
						.replace(
							/thanh pho|tinh|quan|huyen|thi xa|phuong|xa|thi tran|tp\.?|ward|district|province/g,
							"",
						)
						.replace(/hcm/g, "ho chi minh")
						.trim();
				};

				let parts = [];
				if (account.address.includes("||")) {
					parts = account.address.split("||").map((p) => p.trim());
				} else {
					parts = account.address.split(",").map((p) => p.trim());
				}

				if (parts.length >= 3) {
					const provName = parts[parts.length - 1];
					const distName = parts[parts.length - 2];
					const wardName = parts[parts.length - 3];

					const p = provinces.find(
						(prov) =>
							normalizeLoc(prov.name) === normalizeLoc(provName) ||
							normalizeLoc(provName).includes(normalizeLoc(prov.name)),
					);
					if (p) {
						matchedProvinceId = p.id;
						const d = p.districts.find(
							(dist: any) =>
								normalizeLoc(dist.name) === normalizeLoc(distName) ||
								normalizeLoc(distName).includes(normalizeLoc(dist.name)),
						);
						if (d) {
							matchedDistrictId = d.id;
							const w = d.wards.find(
								(ward: any) =>
									normalizeLoc(ward.name) === normalizeLoc(wardName) ||
									normalizeLoc(wardName).includes(normalizeLoc(ward.name)),
							);
							if (w) {
								matchedWardCode = w.code;
								addressDetail = parts.slice(0, parts.length - 3).join(", ");
							} else {
								addressDetail = parts.slice(0, parts.length - 2).join(", ");
							}
						}
					}
				}

				// Fallback
				if (!matchedProvinceId) {
					const addressNorm = normalizeLoc(account.address);
					const p = provinces.find((prov) =>
						addressNorm.includes(normalizeLoc(prov.name)),
					);
					if (p) {
						matchedProvinceId = p.id;
						const d = p.districts.find((dist: any) =>
							addressNorm.includes(normalizeLoc(dist.name)),
						);
						if (d) {
							matchedDistrictId = d.id;
							const w = d.wards.find((ward: any) =>
								addressNorm.includes(normalizeLoc(ward.name)),
							);
							if (w) {
								matchedWardCode = w.code;
								addressDetail = account.address
									.replace(w.name, "")
									.replace(d.name, "")
									.replace(p.name, "")
									.replace(/\|\|/g, "")
									.replace(/,\s*/g, " ")
									.trim();
							}
						}
					}
				}
			}

			setValue("provinceId", matchedProvinceId);
			setValue("districtId", matchedDistrictId);
			setValue("wardCode", matchedWardCode);
			setValue("addressDetail", addressDetail);

			toast.success("Đã tìm thấy thông tin khách hàng");
		} catch (_error) {
			toast.error("Không tìm thấy khách hàng với Username này");
			setValue("accountPk", 0);
		} finally {
			setIsSearching(false);
		}
	};

	useEffect(() => {
		if (open && initialUsername) {
			setValue("username", initialUsername);
			void handleSearchUser(initialUsername);
		}
		if (open && initialPrice) {
			setValue("price", initialPrice);
		}
	}, [open, initialUsername, initialPrice]);

	const onSubmit = async (data: FormValues) => {
		try {
			const provinceName =
				provinces.find((p) => p.id === data.provinceId)?.name || "";
			const districtName =
				districts.find((d: any) => d.id === data.districtId)?.name || "";
			const wardName =
				wards.find((w: any) => w.code === data.wardCode)?.name || "";

			const fullAddress = `${data.addressDetail}, ${wardName}, ${districtName}, ${provinceName}`;

			await createCustomOrder({
				accountPk: data.accountPk,
				fullname: data.fullname,
				phone: data.phone,
				address: fullAddress,
				paymentMethod: data.paymentMethod,
				shippingFee: data.shippingFee,
				total: (data.price || 0) + (data.shippingFee || 0),
				orderDetailRequests: [
					{
						productPk: customProductPk,
						quantity: 1,
						price: data.price,
					},
				],
			});

			toast.success("Tạo đơn hàng custom thành công!");
			setOpen(false);
			reset();
			onCreated?.();
		} catch (_error) {
			toast.error("Tạo đơn hàng thất bại. Vui lòng kiểm tra lại.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<Button className="flex items-center gap-2">
						<PlusCircle className="h-4 w-4" />
						Tạo Đơn Hàng Custom
					</Button>
				)}
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Tạo Đơn Hàng Custom</DialogTitle>
					<DialogDescription>
						Tạo đơn hàng theo yêu cầu, tùy chỉnh giá và tính phí vận chuyển tự
						động.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
					{/* Section 1: Customer */}
					<div className="space-y-4 border p-4 rounded-lg bg-muted/20">
						<h3 className="font-semibold text-sm">1. Thông tin khách hàng</h3>

						<div className="flex gap-2 items-end">
							<div className="flex-1 space-y-2">
								<Label htmlFor="username">Username khách hàng *</Label>
								<Input
									id="username"
									placeholder="Nhập username..."
									{...register("username")}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSearchUser();
										}
									}}
								/>
							</div>
							<Button
								type="button"
								onClick={handleSearchUser}
								disabled={isSearching}
								variant="secondary"
							>
								{isSearching ? (
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
								) : (
									<Search className="w-4 h-4 mr-2" />
								)}
								Tìm
							</Button>
						</div>
						{errors.username && (
							<p className="text-xs text-destructive">
								{errors.username.message}
							</p>
						)}
						{errors.accountPk && (
							<p className="text-xs text-destructive">
								{errors.accountPk.message}
							</p>
						)}

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="fullname">Họ tên người nhận *</Label>
								<Input id="fullname" {...register("fullname")} />
								{errors.fullname && (
									<p className="text-xs text-destructive">
										{errors.fullname.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Số điện thoại *</Label>
								<Input id="phone" {...register("phone")} />
								{errors.phone && (
									<p className="text-xs text-destructive">
										{errors.phone.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Section 2: Shipping */}
					<div className="space-y-4 border p-4 rounded-lg bg-muted/20">
						<h3 className="font-semibold text-sm">
							2. Địa chỉ & Vận chuyển (GHN)
						</h3>

						<div className="space-y-2">
							<Label htmlFor="addressDetail">
								Địa chỉ chi tiết (Số nhà, đường) *
							</Label>
							<Input id="addressDetail" {...register("addressDetail")} />
							{errors.addressDetail && (
								<p className="text-xs text-destructive">
									{errors.addressDetail.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label>Tỉnh/Thành phố *</Label>
								<Select
									value={watchProvinceId ? String(watchProvinceId) : ""}
									onValueChange={(v) => {
										setValue("provinceId", Number(v));
										setValue("districtId", 0);
										setValue("wardCode", "");
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn Tỉnh/Thành" />
									</SelectTrigger>
									<SelectContent>
										{provinces.map((p) => (
											<SelectItem key={p.id} value={String(p.id)}>
												{p.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.provinceId && (
									<p className="text-xs text-destructive">
										{errors.provinceId.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label>Quận/Huyện *</Label>
								<Select
									key={`dist-${watchProvinceId}`}
									disabled={!watchProvinceId}
									value={watchDistrictId ? String(watchDistrictId) : ""}
									onValueChange={(v) => {
										setValue("districtId", Number(v));
										setValue("wardCode", "");
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn Quận/Huyện" />
									</SelectTrigger>
									<SelectContent>
										{districts.map((d: any) => (
											<SelectItem key={d.id} value={String(d.id)}>
												{d.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.districtId && (
									<p className="text-xs text-destructive">
										{errors.districtId.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label>Phường/Xã *</Label>
								<Select
									key={`ward-${watchDistrictId}`}
									disabled={!watchDistrictId}
									value={watchWardCode || ""}
									onValueChange={(v) => setValue("wardCode", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn Phường/Xã" />
									</SelectTrigger>
									<SelectContent>
										{wards.map((w: any) => (
											<SelectItem key={w.code} value={String(w.code)}>
												{w.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.wardCode && (
									<p className="text-xs text-destructive">
										{errors.wardCode.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Section 3: Product & Payment */}
					<div className="space-y-4 border p-4 rounded-lg bg-muted/20">
						<h3 className="font-semibold text-sm">3. Sản phẩm & Thanh toán</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Sản phẩm *</Label>
								<div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground items-center">
									Hoa Custom (Tạo theo yêu cầu)
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="price">Giá trị đơn hàng (VNĐ) *</Label>
								<Input
									id="price"
									type="number"
									{...register("price", { valueAsNumber: true })}
								/>
								{errors.price && (
									<p className="text-xs text-destructive">
										{errors.price.message}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="shippingFee">Phí vận chuyển (VNĐ) *</Label>
								<div className="relative">
									{isCalculatingFee && (
										<Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
									)}
									<Input
										id="shippingFee"
										type="number"
										{...register("shippingFee", { valueAsNumber: true })}
									/>
								</div>
								{errors.shippingFee && (
									<p className="text-xs text-destructive">
										{errors.shippingFee.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label>Phương thức thanh toán *</Label>
								<Select
									value={watchPaymentMethod}
									onValueChange={(v) => setValue("paymentMethod", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn phương thức" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="COD">
											Thanh toán khi nhận hàng (COD)
										</SelectItem>
										<SelectItem value="STORE">
											Thanh toán tại cửa hàng (STORE)
										</SelectItem>
									</SelectContent>
								</Select>
								{errors.paymentMethod && (
									<p className="text-xs text-destructive">
										{errors.paymentMethod.message}
									</p>
								)}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang tạo..." : "Lưu đơn hàng"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
