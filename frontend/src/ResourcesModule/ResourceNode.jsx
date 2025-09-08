import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
    FileText,
    Video,
    BookOpen,
    HelpCircle,
    Plus,
    Edit3,
    Check,
    X,
    Link,
    Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/clerk-react";

const resourceIcons = {
    notes: FileText,
    video: Video,
    assignment: BookOpen,
    quiz: HelpCircle,
};

const resourceColors = {
    notes: "text-notes",
    video: "text-video",
    assignment: "text-assignment",
    quiz: "text-quiz",
};

function ResourceNode({ id, data }) {
    const { label: initialLabel, resources: initialResources, isRoot, isEditing: initialIsEditing, isWebHandler, creatorId } = data;
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(initialIsEditing || false);
    const [label, setLabel] = useState(initialLabel || "Unnamed Node");
    const [resources, setResources] = useState(initialResources || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
    const [isUpdateResourceModalOpen, setIsUpdateResourceModalOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [newResource, setNewResource] = useState({
        name: "",
        type: "notes",
        url: "",
    });
    const url = import.meta.env.VITE_BACKEND_URL;

    const isAuthorized = isSignedIn && isLoaded && (isWebHandler || (user?.id === creatorId));
    console.log("isSignedIn:", isSignedIn);
    console.log("isLoaded:", isLoaded);
    console.log("user object:", user);
    console.log("creatorId:", creatorId);
    console.log("user?.id === creatorId:", user?.id === creatorId);

    console.log("Authorized : ", isAuthorized)

    const handleSaveEdit = async () => {
        if (!isAuthorized) {
            toast.error("You are not authorized to edit this node.");
            return;
        }
        setIsEditing(false);
        try {
            const response = await fetch(`${url}/res/node/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        label,
                        resources,
                        isRoot: isRoot,
                        isEditing: false,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast.success("Node label updated!");
        } catch (error) {
            console.error("Error updating node label:", error);
            toast.error("Failed to update node label.");
        }
    };

    const handleAddResource = () => {
        if (!isAuthorized) {
            toast.error("You are not authorized to add resources.");
            return;
        }
        setIsAddResourceModalOpen(true);
    };

    const handleSaveResource = async () => {
        if (!isAuthorized) {
            toast.error("You are not authorized to add resources.");
            return;
        }
        if (!newResource.name || !newResource.url) {
            toast.error("Name and URL are required!");
            return;
        }
        const resource = {
            id: `resource-${Date.now()}`,
            ...newResource,
        };
        const updatedResources = [...resources, resource];
        setResources(updatedResources);
        setIsAddResourceModalOpen(false);
        setNewResource({ name: "", type: "notes", url: "" });

        try {
            const response = await fetch(`${url}/res/node/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        label,
                        resources: updatedResources,
                        isRoot: isRoot,
                        isEditing,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast.success("Resource added!");
        } catch (error) {
            console.error("Error adding resource:", error);
            toast.error("Failed to add resource.");
        }
    };

    const handleUpdateResource = (resource) => {
        if (!isAuthorized) {
            toast.error("You are not authorized to update resources.");
            return;
        }
        setCurrentResource(resource);
        setNewResource({
            name: resource.name,
            type: resource.type,
            url: resource.url,
        });
        setIsUpdateResourceModalOpen(true);
    };

    const handleSaveUpdatedResource = async () => {
        if (!isAuthorized) {
            toast.error("You are not authorized to update resources.");
            return;
        }
        if (!newResource.name || !newResource.url) {
            toast.error("Name and URL are required!");
            return;
        }
        const updatedResources = resources.map((res) =>
            res.id === currentResource.id ? { ...res, ...newResource } : res
        );
        setResources(updatedResources);
        setIsUpdateResourceModalOpen(false);
        setNewResource({ name: "", type: "notes", url: "" });
        setCurrentResource(null);

        try {
            const response = await fetch(`${url}/res/node/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        label,
                        resources: updatedResources,
                        isRoot: isRoot,
                        isEditing,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast.success("Resource updated!");
        } catch (error) {
            console.error("Error updating resource:", error);
            toast.error("Failed to update resource.");
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!isAuthorized) {
            toast.error("You are not authorized to delete resources.");
            return;
        }
        const updatedResources = resources.filter((res) => res.id !== resourceId);
        setResources(updatedResources);

        try {
            const response = await fetch(`${url}/res/node/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        label,
                        resources: updatedResources,
                        isRoot: isRoot,
                        isEditing,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast.success("Resource deleted!");
        } catch (error) {
            console.error("Error deleting resource:", error);
            toast.error("Failed to delete resource.");
        }
    };

    return (
        <div className="group transition-colors duration-300">
            <Handle
                type="target"
                position={Position.Top}
                id="top-target"
                className="w-3 h-3 border-2 border-primary bg-background"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="w-3 h-3 border-2 border-primary bg-background"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="w-3 h-3 border-2 border-primary bg-background"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom-source"
                className="w-3 h-3 border-2 border-primary bg-background"
            />

            <Card
                className={`min-w-48 bg-card border border-muted shadow-card transition-colors duration-300 ${isRoot ? "border-primary border-2 shadow-glow" : ""
                    } ${isExpanded ? "min-h-64" : ""}`}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                                <Input
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="text-sm font-semibold"
                                    autoFocus
                                    disabled={!isAuthorized}
                                />
                                <Button size="sm" variant="ghost" onClick={handleSaveEdit} disabled={!isAuthorized}>
                                    <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    disabled={!isAuthorized}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h3
                                    className={`font-semibold text-sm ${isRoot ? "text-primary" : "text-foreground"
                                        }`}
                                >
                                    {label}
                                </h3>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditing(true)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={!isAuthorized}
                                >
                                    <Edit3 className="w-3 h-3" />
                                </Button>
                            </>
                        )}
                    </div>

                    {resources.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                            <Badge
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {resources.length} resource{resources.length !== 1 ? "s" : ""}
                            </Badge>
                            {!isExpanded && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsExpanded(true)}
                                    className="text-xs opacity-60 hover:opacity-100"
                                >
                                    View All
                                </Button>
                            )}
                        </div>
                    )}

                    {(isExpanded || resources.length <= 2) && (
                        <div className="space-y-2 mb-3">
                            {resources
                                .slice(0, isExpanded ? undefined : 2)
                                .map((resource) => {
                                    const Icon = resourceIcons[resource.type] || FileText;
                                    return (
                                        <div
                                            key={resource.id}
                                            className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 border border-muted text-text transition-colors group/resource cursor-pointer"
                                            onClick={() => window.open(resource.url, "_blank")}
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Icon
                                                    className={`w-4 h-4 ${resourceColors[resource.type]} flex-shrink-0`}
                                                />
                                                <span className="text-xs truncate">
                                                    {resource.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-6 h-6 p-0 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(resource.url, "_blank");
                                                    }}
                                                    title="Open Link"
                                                >
                                                    <Link className="w-3 h-3" />
                                                </Button>
                                                {isAuthorized && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="w-6 h-6 p-0 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateResource(resource);
                                                            }}
                                                            title="Edit Resource"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="w-6 h-6 p-0 opacity-0 group-hover/resource:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteResource(resource.id);
                                                            }}
                                                            title="Delete Resource"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddResource}
                        className="w-full text-xs border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-colors"
                        disabled={!isAuthorized}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Resource
                    </Button>
                </div>
            </Card>

            <Dialog open={isAddResourceModalOpen} onOpenChange={setIsAddResourceModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card text-text border border-muted p-6 rounded-lg">
                    <DialogTitle className="text-lg font-semibold">Add Resource</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Enter details for the new resource, including its name, type, and URL.
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="resource-name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                id="resource-name"
                                value={newResource.name}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, name: e.target.value })
                                }
                                placeholder="Enter resource name"
                                className="text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-type" className="text-sm font-medium">
                                Type
                            </label>
                            <select
                                id="resource-type"
                                value={newResource.type}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, type: e.target.value })
                                }
                                className="text-sm border border-muted rounded-md p-2 bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="notes">Notes</option>
                                <option value="video">Video</option>
                                <option value="assignment">Assignment</option>
                                <option value="quiz">Quiz</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-url" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="resource-url"
                                value={newResource.url}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, url: e.target.value })
                                }
                                placeholder="Enter resource URL"
                                className="text-sm"
                                type="url"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddResourceModalOpen(false)}
                            className="text-sm border border-muted"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveResource} className="text-sm">
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateResourceModalOpen} onOpenChange={setIsUpdateResourceModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card text-text border border-muted p-6 rounded-lg">
                    <DialogTitle className="text-lg font-semibold">Update Resource</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Update the details for the resource, including its name, type, and URL.
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="resource-name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                id="resource-name"
                                value={newResource.name}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, name: e.target.value })
                                }
                                placeholder="Enter resource name"
                                className="text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-type" className="text-sm font-medium">
                                Type
                            </label>
                            <select
                                id="resource-type"
                                value={newResource.type}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, type: e.target.value })
                                }
                                className="text-sm border border-muted rounded-md p-2 bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="notes">Notes</option>
                                <option value="video">Video</option>
                                <option value="assignment">Assignment</option>
                                <option value="quiz">Quiz</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="resource-url" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="resource-url"
                                value={newResource.url}
                                onChange={(e) =>
                                    setNewResource({ ...newResource, url: e.target.value })
                                }
                                placeholder="Enter resource URL"
                                className="text-sm"
                                type="url"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsUpdateResourceModalOpen(false);
                                setNewResource({ name: "", type: "notes", url: "" });
                                setCurrentResource(null);
                            }}
                            className="text-sm border border-muted"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUpdatedResource} className="text-sm">
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(ResourceNode);