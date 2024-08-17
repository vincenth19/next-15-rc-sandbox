import { Person } from "@prisma/client";
import { getPeople } from "@/actions/people";
import PeopleTable from "@/components/people-table";

const PeoplePage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
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

  const result = await getPeople(filter);
  return (
    <>
      <PeopleTable result={result} searchParams={searchParams} />
    </>
  );
};

export default PeoplePage;
