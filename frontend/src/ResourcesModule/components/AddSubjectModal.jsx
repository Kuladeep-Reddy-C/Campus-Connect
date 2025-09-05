import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export function AddSubjectModal({ isOpen, onClose, onSubmit }) {
    const [subjectName, setSubjectName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (subjectName.trim()) {
            onSubmit(subjectName);
            setSubjectName(""); // Reset input
            onClose(); // Close modal
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-muted rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-2xl font-semibold text-text">
                            Add New Subject
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" className="text-text hover:bg-background">
                                <X className="w-5 h-5" />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="subjectName" className="block text-sm font-medium text-text mb-2">
                                Subject Name
                            </label>
                            <input
                                id="subjectName"
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="w-full p-2 bg-background border border-muted rounded-md text-text focus:ring-2 focus:ring-primary"
                                placeholder="Enter subject name"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-card text-text hover:bg-background"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary text-text hover:bg-primary/90"
                            >
                                Add Subject
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}