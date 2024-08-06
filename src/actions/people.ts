"use server";

import { z } from "zod";
import { Person, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { personFormSchema } from "@/schemas/person";
import prisma from "@/lib/db";
import { ActionState } from "@/lib/types/actionState";

export async function createPerson(
  prevState: any,
  payload: {
    formData: z.infer<typeof personFormSchema>;
    pathToRevalidate?: string;
  }
): Promise<ActionState> {
  try {
    const { formData, pathToRevalidate = "/people" } = payload;
    const result = await prisma.person.create({
      data: {
        ...formData,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error createPerson: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    return { success: false, error: `Unexpected error: ${error}` };
  }
}

export async function updatePerson(
  prevState: any,
  payload: {
    formData: z.infer<typeof personFormSchema>;
    personId: string;
    pathToRevalidate?: string;
  }
): Promise<ActionState> {
  try {
    const { formData, personId, pathToRevalidate = "/people" } = payload;
    const result = await prisma.person.update({
      data: {
        ...formData,
      },
      where: {
        id: personId,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error updatePerson: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    return {
      success: false,
      error: `Unexpected error @updatePerson: ${error}`,
    };
  }
}

export async function getPeople(
  filter: Partial<Person> | null = null,
  pathToRevalidate = "/people"
): Promise<ActionState> {
  try {
    const where: Prisma.PersonWhereInput = filter || {};
    const result = await prisma.person.findMany({ where });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error getPeople: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    console.error("Error getPeople: ", error);
    return { success: false, error: `Unexpected error @getPeople: ${error}` };
  }
}

export async function deletePerson(
  prevState: any,
  payload: {
    personIdToDelete: string;
    pathToRevalidate?: string;
  }
): Promise<ActionState> {
  try {
    const { personIdToDelete, pathToRevalidate = "/people" } = payload;
    const result = await prisma.person.delete({
      where: {
        id: personIdToDelete,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error deletePerson: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    return {
      success: false,
      error: `Unexpected error @deletePerson: ${error}`,
    };
  }
}
