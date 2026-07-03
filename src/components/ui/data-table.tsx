"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	type ExpandedState,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	renderSubComponent?: (props: { row: any }) => React.ReactNode;
	getRowCanExpand?: (row: any) => boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	renderSubComponent,
	getRowCanExpand = () => false,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getRowId: (row: any, index) =>
			row.pk ? String(row.pk) : row.id ? String(row.id) : String(index),
		onExpandedChange: setExpanded,
		getExpandedRowModel: getExpandedRowModel(),
		getRowCanExpand,
		state: {
			sorting,
			expanded,
		},
	});

	return (
		<div className="space-y-4">
			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
								<TableRow
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
								{row.getIsExpanded() && renderSubComponent && (
									<TableRow>
										{/* 2nd row is a custom 1 cell row */}
										<TableCell colSpan={row.getVisibleCells().length}>
											{renderSubComponent({ row })}
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									Không có dữ liệu.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
