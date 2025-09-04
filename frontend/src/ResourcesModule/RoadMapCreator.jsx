import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
    Plus,
    Trash2,
    GripVertical,
    Map,
    Target,
    Clock,
    BookOpen,
    Save
} from 'lucide-react';

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700',
    advanced: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700',
};

export function RoadmapCreator({ open, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([
        {
            id: '1',
            title: '',
            description: '',
            estimatedTime: '',
            difficulty: 'beginner',
            resources: []
        }
    ]);

    const addStep = () => {
        const newStep = {
            id: Date.now().toString(),
            title: '',
            description: '',
            estimatedTime: '',
            difficulty: 'beginner',
            resources: []
        };
        setSteps([...steps, newStep]);
    };

    const updateStep = (id, field, value) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    const removeStep = (id) => {
        if (steps.length > 1) {
            setSteps(steps.filter(step => step.id !== id));
        }
    };

    const handleSave = () => {
        if (title.trim() && steps.every(step => step.title.trim())) {
            onSave({
                title: title.trim(),
                description: description.trim(),
                steps: steps.filter(step => step.title.trim())
            });
            handleReset();
            onClose();
        }
    };

    const handleReset = () => {
        setTitle('');
        setDescription('');
        setSteps([{
            id: '1',
            title: '',
            description: '',
            estimatedTime: '',
            difficulty: 'beginner',
            resources: []
        }]);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-node-border shadow-soft">
                <DialogHeader className="pb-6">
                    <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                            <Map className="w-6 h-6 text-white" />
                        </div>
                        Create Learning Roadmap
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Roadmap Basic Info */}
                    <Card className="p-6 bg-node-bg border-node-border shadow-soft">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Roadmap Title
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Complete Web Development Path"
                                    className="text-lg font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Description
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the learning objectives and outcomes..."
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Steps Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                <Target className="w-5 h-5 text-primary" />
                                Learning Steps
                                <Badge variant="secondary" className="ml-2">
                                    {steps.length} step{steps.length !== 1 ? 's' : ''}
                                </Badge>
                            </h3>
                            <Button
                                onClick={addStep}
                                variant="outline"
                                className="border-dashed border-node-border hover:border-primary hover:bg-primary/5"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Step
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <Card
                                    key={step.id}
                                    className="p-6 bg-node-bg border-node-border shadow-soft hover:shadow-glow transition-all duration-300"
                                >
                                    <div className="space-y-4">
                                        {/* Step Header */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <Input
                                                    value={step.title}
                                                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                                                    placeholder={`Step ${index + 1} title...`}
                                                    className="font-semibold text-lg"
                                                />
                                                <Textarea
                                                    value={step.description}
                                                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                                                    placeholder="Describe what students will learn in this step..."
                                                    rows={3}
                                                    className="resize-none"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => removeStep(step.id)}
                                                disabled={steps.length === 1}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Step Metadata */}
                                        <div className="flex items-center gap-4 ml-14">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    value={step.estimatedTime || ''}
                                                    onChange={(e) => updateStep(step.id, 'estimatedTime', e.target.value)}
                                                    placeholder="e.g., 2 hours"
                                                    className="w-32 text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Difficulty:</span>
                                                <select
                                                    value={step.difficulty}
                                                    onChange={(e) => updateStep(step.id, 'difficulty', e.target.value)}
                                                    className="px-3 py-1 rounded-md border border-node-border bg-node-bg text-sm text-foreground"
                                                >
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                                <Badge className={difficultyColors[step.difficulty || 'beginner']}>
                                                    {step.difficulty}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-node-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span>This roadmap will be added to your mind map</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!title.trim() || !steps.every(step => step.title.trim())}
                                className="bg-gradient-primary hover:shadow-glow"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Create Roadmap
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
