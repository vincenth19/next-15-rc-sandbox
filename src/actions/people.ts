"use server";

import { z } from "zod";
import { Person, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { personFormSchema } from "@/schemas/person";
import prisma from "@/lib/db";
import { ActionState } from "@/lib/types/actionState";

async function createPerson(
  prevState: any,
  data: z.infer<typeof personFormSchema>,
  pathToRevalidate = "/people"
): Promise<ActionState> {
  try {
    const result = await prisma.person.create({
      data: {
        ...data,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error getPeople: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    return { success: false, error: `Unexpected error: ${error}` };
  }
}

async function updatePerson(
  prevState: any,
  data: { formData: z.infer<typeof personFormSchema>; personId: string },
  pathToRevalidate = "/people"
): Promise<ActionState> {
  try {
    const result = await prisma.person.update({
      data: {
        ...data.formData,
      },
      where: {
        id: data.personId,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error getPeople: ", error);
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

async function getPeople(
  filter: Partial<Person> | null = null
): Promise<ActionState> {
  try {
    const where: Prisma.PersonWhereInput = filter || {};
    const result = await prisma.person.findMany({ where });
    return { success: true, error: null, data: result };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const cause = error.meta?.cause as Error;
      const errorMessage = cause || error.message;
      return { success: false, error: errorMessage.toString(), data: null };
    }
    console.error("Error getPeople: ", error);
    return { success: false, error: `Unexpected error @getPeople: ${error}` };
  }
}

async function deletePerson(
  prevState: any,
  personIdToDelete: string,
  pathToRevalidate = "/people"
): Promise<ActionState> {
  try {
    const result = await prisma.person.delete({
      where: {
        id: personIdToDelete,
      },
    });
    revalidatePath(pathToRevalidate);
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error("Error getPeople: ", error);
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

export { getPeople, createPerson, updatePerson, deletePerson };
