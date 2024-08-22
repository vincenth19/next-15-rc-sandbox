"use client";

import Image from "next/image";
import { useState } from "react";
import { Person } from "@prisma/client";
import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { LucideEdit, LucideTrash2 } from "lucide-react";
import { ActionState } from "@/lib/types/actionState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddEditPersonForm2 from "@/components/add-edit-person-form-2";
import DeletePersonAlertDialog2 from "@/components/delete-person-alert-dialog-2";

function formatValue(value: string | Date | null, key: string) {
  let displayedValue = value ?? "";
  if (value instanceof Date && key === "date_of_birth") {
    displayedValue = format(new Date(value), "do MMM yyyy", { locale: enAU });
  } else if (
    (value instanceof Date && key === "created_at") ||
    (value instanceof Date && key === "updated_at")
  ) {
    displayedValue = format(new Date(value), "dd-MM-yyyy kk:mm:ss.SSS z", {
      locale: enAU,
    });
  } else {
    displayedValue = displayedValue.toString();
  }
  return displayedValue;
}

function ErrorStateView({ error = "-" }: { error?: string | null }) {
  return (
    <>
      <div
        className="flex items-center flex-col justify-center gap-5 p-4"
        style={{
          height: "calc(100dvh - 12rem)",
        }}
      >
        <div className="flex items-center flex-col justify-center">
          <Image
            src={"/images/server-error.svg"}
            width={300}
            height={300}
            alt="A broken laptop on top of broken server"
          />
          <p className="font-semibold text-2xl">Cannot Get Data</p>
          <p className="text-gray-600 text-l">
            There is an error when trying to get your data. Please try again
            later
          </p>
          {error ? (
            <p className="text-gray-600 text-m">{`Error: ${error}`}</p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function NoResultView() {
  return (
    <div
      className="flex items-center flex-col justify-center gap-5 p-4"
      style={{
        height: "calc(100dvh - 12rem)",
      }}
    >
      <div className="flex items-center flex-col justify-center">
        <Image
          src={"/images/not-found-girl.svg"}
          width={300}
          height={300}
          alt="A woman holding a cable"
        />
        <p className="font-semibold text-2xl">No Result Found</p>
        <p className="text-gray-600 text-l">Try updating your search query</p>
      </div>
    </div>
  );
}

function EmptyView() {
  return (
    <>
      <div
        className="flex items-center flex-col justify-center gap-5 p-4"
        style={{
          height: "calc(100dvh - 12rem)",
        }}
      >
        <div className="flex items-center flex-col justify-center">
          <Image
            src={"/images/list-bro.svg"}
            width={300}
            height={300}
            alt="A man thinking with a list"
          />
          <p className="font-semibold text-2xl">No Person in Database</p>
          <p className="text-gray-600 text-l">Start adding a person!</p>
        </div>
      </div>
      ;
    </>
  );
}

function GetAllView({
  people,
  onClickEdit,
  onClickDelete,
}: {
  people: Person[];
  onClickEdit: (person: Person) => void;
  onClickDelete: (person: Person) => void;
}) {
  const cols = Object.keys(people[0]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((keyName) => {
              if (keyName !== "id" && keyName !== "user_id") {
                return (
                  <TableHead key={`row-${keyName}`}>
                    {keyName.replaceAll("_", " ").toUpperCase()}
                  </TableHead>
                );
              }
            })}
            <TableHead colSpan={2} className="text-center">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person, idx) => {
            return (
              <TableRow key={person.id}>
                {Object.entries(person).map(([key, value]) => {
                  if (key !== "id" && key !== "user_id") {
                    return (
                      <TableCell key={`cell-${key}-${idx}`}>
                        {formatValue(value, key)}
                      </TableCell>
                    );
                  }
                })}
                <TableCell className="flex space-x-3 justify-center">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      onClickEdit(person);
                    }}
                  >
                    <LucideEdit size={20} />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      onClickDelete(person);
                    }}
                  >
                    <LucideTrash2 size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default function PeopleTable({
  result,
  searchParams,
}: {
  result: ActionState;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const hasSearchParams = searchParams && Object.keys(searchParams).length > 0;
  const { success, error, data: people } = result;

  const [person, setPerson] = useState<Person | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddPersonFormDialog, setOpenAddPersonFormDialog] = useState(false);
  const [openEditPersonFormDialog, setOpenEditPersonFormDialog] =
    useState(false);

  function onClickDelete(person: Person) {
    setPerson(person);
    setOpenDeleteDialog(true);
  }

  function onClickEdit(person: Person) {
    setPerson(person);
    setOpenEditPersonFormDialog(true);
  }

  return (
    <>
      {person ? (
        <AddEditPersonForm2
          isOpen={openEditPersonFormDialog}
          setIsOpen={setOpenEditPersonFormDialog}
          person={person}
        />
      ) : null}

      {person ? (
        <DeletePersonAlertDialog2
          isOpen={openDeleteDialog}
          setIsOpen={setOpenDeleteDialog}
          id={person.id}
          name={`"${person.first_name} ${person.last_name}"`}
        />
      ) : null}

      {!success ? <ErrorStateView error={error} /> : null}
      {success && people.length === 0 && hasSearchParams ? (
        <NoResultView />
      ) : null}
      {success && people.length === 0 && !hasSearchParams ? (
        <EmptyView />
      ) : null}
      {success && people.length > 0 ? (
        <>
          <div className="flex items-center justify-end pb-3">
            <AddEditPersonForm2
              isOpen={openAddPersonFormDialog}
              setIsOpen={setOpenAddPersonFormDialog}
              trigger={<Button variant={"default"}>Add Person</Button>}
            />
          </div>
          <GetAllView
            people={people}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        </>
      ) : null}
    </>
  );
}
