import { Dispatch, SetStateAction } from "react";
import DeleteAlertDialog from "./generic-components/delete-alert-dialog";
import { deletePerson } from "@/actions/people";

export default function DeletePersonAlertDialog2({
  isOpen,
  setIsOpen,
  id,
  name,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
  name: string;
}) {
  return (
    <>
      <DeleteAlertDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteActionPayload={{
          personIdToDelete: id,
        }}
        deleteAction={deletePerson}
        dataLabel={name}
      />
    </>
  );
}
