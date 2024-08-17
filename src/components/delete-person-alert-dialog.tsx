"use client";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { deletePerson } from "@/actions/people";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const DeletePersonAlertDialog = ({
  isOpen,
  setIsOpen,
  name,
  id,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
}) => {
  const { toast } = useToast();
  const [deletePersonActionState, deletePersonAction, deletePersonPending] =
    useActionState(deletePerson, null);

  useEffect(() => {
    if (deletePersonActionState?.success === true) {
      toast({
        title: "Delete Person Successful",
        description: "Person is successfully deleted",
      });
      setIsOpen(false);
    } else if (
      deletePersonActionState?.success === false &&
      deletePersonActionState?.error
    ) {
      toast({
        title: "Delete Person Error",
        description: `There is an issue when deleting person. ${deletePersonActionState.error}`,
        variant: "destructive",
      });
      console.error("deletePersonDialog: ", deletePersonActionState.error);
    }
  }, [toast, deletePersonActionState]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Delete "${name}"?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete\n`}
            <strong>{`"${name}"`}</strong>
            {` and remove this person from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full flex flex-col sm:flex-row space-2 justify-between">
            <Button
              disabled={deletePersonPending}
              onClick={() => {
                deletePersonAction({ personIdToDelete: id });
              }}
              variant={"destructive"}
            >
              {deletePersonPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deletePersonPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePersonAlertDialog;
