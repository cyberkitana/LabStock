"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/*
  STORAGE LOCATION ACTIONS

  Used by:
  - StorageManager

  Functions:
  - createStorageLocation()
  - updateStorageLocation()
  - deleteStorageLocation()
*/


/*
  CREATE STORAGE LOCATION
*/

export async function createStorageLocation(
  formData: FormData
) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Storage location name is required.");
  }

  const type =
    String(formData.get("type") ?? "").trim() || null;

  const temperature =
    String(formData.get("temperature") ?? "").trim() || null;

  await prisma.storageLocation.create({
    data: {
      name,
      type,
      temperature,
    },
  });

  revalidatePath("/storage");
}


/*
  UPDATE STORAGE LOCATION
*/

export async function updateStorageLocation(
  formData: FormData
) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Storage location ID is required.");
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Storage location name is required.");
  }

  const type =
    String(formData.get("type") ?? "").trim() || null;

  const temperature =
    String(formData.get("temperature") ?? "").trim() || null;

  await prisma.storageLocation.update({
    where: {
      id,
    },
    data: {
      name,
      type,
      temperature,
    },
  });

  revalidatePath("/storage");
}


/*
  DELETE STORAGE LOCATION

  Deletes a storage location by ID.

  The UI should confirm the deletion before
  calling this action.
*/

export async function deleteStorageLocation(
  id: string
) {
  if (!id) {
    throw new Error("Storage location ID is required.");
  }

  await prisma.storageLocation.delete({
    where: {
      id,
    },
  });

  revalidatePath("/storage");
}