import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export type CardNodeData = {
  title: string;
  content: string;
  onUpdate?: (id: string, data: { title: string; content: string }) => void;
  onDelete?: (id: string) => void;
};

export type CardNode = Node<CardNodeData>;

export function CustomNode({ id, data, selected }: NodeProps<CardNode>) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);

  useEffect(() => {
    setTitle(data.title);
    setContent(data.content);
  }, [data.title, data.content]);

  const handleSave = useCallback(() => {
    if (data.onUpdate) {
      data.onUpdate(id, { title, content });
    }
    setIsEditing(false);
  }, [data, id, title, content]);

  const handleCancel = useCallback(() => {
    setTitle(data.title);
    setContent(data.content);
    setIsEditing(false);
  }, [data.title, data.content]);

  const handleDelete = useCallback(() => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  }, [data, id]);

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      {/* Pin Visual */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-5 h-5 rounded-full bg-destructive shadow-[1px_1px_2px_rgba(0,0,0,0.3)] border-b-2 border-destructive-foreground/20"></div>
      </div>

      <Card 
        onDoubleClick={() => setIsEditing(true)}
        className={`w-64 border-none transition-all duration-200 bg-card text-card-foreground
          ${selected ? 'ring-4 ring-primary/20 shadow-[0_10px_25px_rgba(0,0,0,0.15)] rotate-0 scale-105 z-10' : 'shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_12px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:rotate-1'}
        `}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 pt-6">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-bold h-9 text-lg bg-transparent border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 font-sans"
              placeholder="Title"
              autoFocus
            />
          ) : (
            <CardTitle className="text-xl font-bold leading-none truncate pr-4 font-sans text-primary">
              {data.title || "Untitled"}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-2 pb-6">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] text-base bg-transparent border-none resize-none focus-visible:ring-0 font-sans px-0"
              placeholder="Content..."
            />
          ) : (
            <p className="text-base text-card-foreground/80 min-h-[20px] whitespace-pre-wrap break-words font-sans leading-relaxed">
              {data.content || "No content"}
            </p>
          )}
        </CardContent>
        
        {/* Action Buttons */}
        <div className={`absolute -bottom-4 right-4 flex gap-2 transition-all duration-200 ${isEditing || selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {isEditing ? (
            <>
              <Button size="icon" className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 shadow-sm" onClick={handleSave}>
                <Check className="h-4 w-4 text-white" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
