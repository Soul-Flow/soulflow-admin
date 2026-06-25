import { NextResponse } from "next/server";
import { defaultLocations } from "@/lib/data/default-locations";

export async function GET() {
	try {
		return NextResponse.json(defaultLocations);
	} catch {
		return NextResponse.json(
			{
				message: "Unable to load delivery locations. Please try again shortly.",
			},
			{ status: 500 },
		);
	}
}
