"use server";

import { personFormSchema } from "@/components/person-dialog-form";
import prisma from "@/lib/db";
import { Person } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function createPerson(
  data: z.infer<typeof personFormSchema>,
  pathToRevalidate = "/people"
) {
  try {
    const result = await prisma.person.create({
      data: {
        ...data,
      },
    });
    revalidatePath(pathToRevalidate);
    return result;
  } catch (error) {
    throw new Error(`createPerson: ${error}`);
  }
}

async function updatePerson(
  dataId: string,
  data: z.infer<typeof personFormSchema>,
  pathToRevalidate = "/people"
) {
  try {
    const result = await prisma.person.update({
      data: {
        ...data,
      },
      where: {
        id: dataId,
      },
    });
    revalidatePath(pathToRevalidate);
    return result;
  } catch (error) {
    throw new Error(`updatePerson: ${error}`);
  }
}

async function getPeople(filter: Person | null) {
  try {
    const result = await prisma.person.findMany({
      where: {
        ...filter,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`getPeople: ${error}`);
  }
}

async function deletePerson(
  personIdToDelete: string,
  pathToRevalidate = "/people"
) {
  try {
    const result = await prisma.person.delete({
      where: {
        id: personIdToDelete,
      },
    });
    revalidatePath(pathToRevalidate);
    return result;
  } catch (error) {
    throw new Error(`deletePerson: ${error}`);
  }
}

export { getPeople, createPerson, updatePerson, deletePerson };
