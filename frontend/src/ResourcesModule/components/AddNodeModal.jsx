import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function AddNodeModal({ isOpen, onClose, onSubmit, nodes }) {
    const [selectedNodeType, setSelectedNodeType] = useState("resource");

    const hasStartNode = nodes.some((node) => node.type === "start");
    const hasEndNode = nodes.some((node) => node.type === "end");

    const nodeOptions = [
        { value: "resource", label: "Resource", disabled: false },
        { value: "start", label: "Start", disabled: hasStartNode },
        { value: "end", label: "End", disabled: hasEndNode },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedNodeType === "start" && hasStartNode) {
            toast.error("Only one Start node is allowed.");
            return;
        }
        if (selectedNodeType === "end" && hasEndNode) {
            toast.error("Only one End node is allowed.");
            return;
        }
        onSubmit(selectedNodeType);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-muted rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-2xl font-semibold text-text">
                            Add New Node
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" className="text-text hover:bg-background">
                                <X className="w-5 h-5" />
                            </Button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="nodeType"
                                className="block text-sm font-medium text-text mb-2"
                            >
                                Node Type
                            </label>
                            <Select.Root
                                value={selectedNodeType}
                                onValueChange={setSelectedNodeType}
                            >
                                <Select.Trigger
                                    className="w-full flex justify-between items-center bg-background border border-muted rounded-md px-3 py-2 text-text"
                                    aria-label="Node Type"
                                >
                                    <Select.Value placeholder="Select a node type" />
                                    <Select.Icon>
                                        <ChevronDown className="w-4 h-4" />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content
                                        className="bg-card border border-muted rounded-md shadow-lg z-50"
                                    >
                                        <Select.Viewport>
                                            {nodeOptions.map((option) => (
                                                <Select

                                                    .Item
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={option.disabled}
                                                    className={`px-3 py-2 text-text hover:bg-muted cursor-pointer ${option.disabled ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                >
                                                    <Select.ItemText>{option.label}</Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
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
                                Add Node
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}