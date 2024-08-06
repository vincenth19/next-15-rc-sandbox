import Image from "next/image";
import { Person } from "@prisma/client";
import { getPeople } from "@/actions/people";
import PeopleTable from "@/components/people-table";
import PersonDialogForm from "@/components/person-dialog-form";

const PeoplePage = async ({
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

  const { success, error, data: people } = await getPeople(filter);
  return (
    <>
      {!success ? (
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
      ) : null}
      {success && people.length > 0 ? (
        <>
          <div className="flex items-center justify-end pb-3">
            <PersonDialogForm />
          </div>
          <PeopleTable people={people} />
        </>
      ) : null}
      {success && people.length === 0 && hasSearchParams ? (
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
            <p className="text-gray-600 text-l">
              Try updating your search query
            </p>
          </div>
        </div>
      ) : null}
      {success && people.length === 0 && !hasSearchParams ? (
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
          <PersonDialogForm />
        </div>
      ) : null}
    </>
  );
};

export default PeoplePage;
