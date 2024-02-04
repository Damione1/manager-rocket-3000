"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Item } from "./lightspeed-types";

const baseUrl = "https://api.lightspeedapp.com/API/V3";

export async function getItem(filters: Record<string, string>) {
  try {
    const session = await getServerSession(authOptions);
    const queryParameters = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const response = await fetch(
      `${baseUrl}/Account/${session?.user?.shopAccountID}/Item.json?${queryParameters}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responceObj = await response.json();

    if (!responceObj.Item) {
      return { item: null, error: "Item not found" };
    }

    const item = responceObj.Item as Item;

    return { item: item, error: null };
  } catch (error: any) {
    return {
      item: null,
      error: error.message,
    };
  }
}

export async function updateItem(itemPayload: Item) {
  try {
    if (!itemPayload.itemID) {
      throw new Error("Item ID is required");
    }
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `${baseUrl}/Account/${session?.user?.shopAccountID}/Item/${itemPayload.itemID}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(itemPayload),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responceObj = await response.json();

    if (!responceObj.Item) {
      return { item: null, error: "Item not found" };
    }

    const item = responceObj.Item as Item;

    return { item: item, error: null };
  } catch (error: any) {
    return {
      item: null,
      error: error.message,
    };
  }
}
