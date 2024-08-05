import PeopleTable from "@/components/people-table";
import PersonDialogForm from "@/components/person-dialog-form";
import { Person } from "@prisma/client";
import { getPeople } from "@/actions/people";
import Image from "next/image";

const People = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const hasSearchParams = searchParams && Object.keys(searchParams).length > 0;
  const filter: Partial<Person> = {};
  if (searchParams?.id && typeof searchParams.id === "string") {
    filter.id = searchParams.id;
  }
  if (searchParams?.user_id && typeof searchParams.user_id === "string") {
    filter.user_id = searchParams.user_id;
  }
  if (searchParams?.first_name && typeof searchParams.first_name === "string") {
    filter.first_name = searchParams.first_name;
  }
  if (searchParams?.last_name && typeof searchParams.last_name === "string") {
    filter.last_name = searchParams.last_name;
  }
  if (
    searchParams?.phone_number &&
    typeof searchParams.phone_number === "string"
  ) {
    filter.phone_number = searchParams.phone_number;
  }
  if (
    searchParams?.date_of_birth &&
    typeof searchParams.date_of_birth === "string"
  ) {
    filter.date_of_birth = new Date(searchParams.date_of_birth);
  }
  if (searchParams?.created_at && typeof searchParams.created_at === "string") {
    filter.created_at = new Date(searchParams.created_at);
  }
  if (searchParams?.updated_at && typeof searchParams.updated_at === "string") {
    filter.updated_at = new Date(searchParams.updated_at);
  }
  const people = await getPeople(filter);
  return (
    <div className="p-4">
      {people.length > 0 ? (
        <>
          <div className="flex items-center justify-end pb-3">
            <PersonDialogForm />
          </div>
          <PeopleTable people={people} />
        </>
      ) : null}
      {people.length === 0 && hasSearchParams ? (
        <div
          className="w-full p-5 text-center flex flex-col justify-center gap-3 h-full"
          style={{
            height: "calc(100dvh - 7rem)",
          }}
        >
          <p className="text-muted-foreground">No result found</p>
        </div>
      ) : null}
      {people.length === 0 && !hasSearchParams ? (
        <div
          className="flex items-center flex-col justify-center gap-5 p-4"
          style={{
            height: "calc(100dvh - 7rem)",
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
          <PersonDialogForm />
        </div>
      ) : null}
    </div>
  );
};

export default People;
