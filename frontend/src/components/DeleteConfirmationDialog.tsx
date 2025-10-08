import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  itemType: "product" | "user";
  isLoading?: boolean;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType,
  isLoading = false,
}: DeleteConfirmationDialogProps) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmationText("");
      setIsConfirmed(false);
      setAttempts(0);
    }
  }, [isOpen]);

  const handleConfirmationChange = (value: string) => {
    setConfirmationText(value);
    const isExactMatch = value === itemName;
    setIsConfirmed(isExactMatch);
    
    // Track attempts for security
    if (value && !isExactMatch && value.length >= itemName.length * 0.5) {
      setAttempts(prev => prev + 1);
    }
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmationText("");
      setIsConfirmed(false);
      setAttempts(0);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setIsConfirmed(false);
    setAttempts(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Trash2 className="h-6 w-6 text-destructive" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Deleting {itemType}: <span className="font-bold">{itemName}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                This action is irreversible.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              To confirm, type <span className="font-bold text-destructive">{itemName}</span> in the box below:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => handleConfirmationChange(e.target.value)}
              placeholder={`Type "${itemName}" to confirm`}
              className={`font-mono ${attempts > 2 ? 'border-destructive focus:border-destructive' : ''}`}
              autoComplete="off"
              disabled={isLoading}
            />
            {confirmationText && !isConfirmed && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Text must match exactly: <span className="font-mono font-bold">"{itemName}"</span>
                </p>
                {attempts > 2 && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Multiple incorrect attempts detected. Please be more careful.
                  </p>
                )}
              </div>
            )}
            {isConfirmed && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
                Confirmation text matches. You can now delete.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? "Deleting..." : `Delete ${itemType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
