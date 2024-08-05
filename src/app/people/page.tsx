import PeopleTable from "@/components/people-table";
import PersonDialogForm from "@/components/person-dialog-form";
import { Person } from "@prisma/client";
import { getPeople } from "@/actions/people";
import Image from "next/image";

const People = async ({ filter = null }: { filter?: Person | null }) => {
  const people = await getPeople(filter);

  return (
    <div className="p-4">
      {/* {people.length === 0 ? <p>Loading...</p> : null} */}
      {people.length > 0 ? (
        <>
          <div className="flex items-center justify-end pb-3">
            <PersonDialogForm />
          </div>
          <PeopleTable people={people} />
        </>
      ) : null}
      {people.length === 0 && filter ? (
        <div className="w-full p-5 text-center flex flex-col justify-center gap-3 h-full">
          <p className="text-muted-foreground">No result found</p>
        </div>
      ) : null}
      {people.length === 0 && !filter ? (
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
