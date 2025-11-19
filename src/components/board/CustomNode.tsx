import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X } from 'lucide-react';

// Define the data structure for our card
export type CardNodeData = {
  title: string;
  content: string;
  // callbacks for interactions
  onUpdate?: (id: string, data: { title: string; content: string }) => void;
  onDelete?: (id: string) => void;
};

// We extend the generic Node type
export type CardNode = Node<CardNodeData>;

export function CustomNode({ id, data, selected }: NodeProps<CardNode>) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);

  // Sync state with props if external updates happen
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
      {/* Handles for potential connections - hidden for now but good practice */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <Card className={`w-64 shadow-md transition-shadow ${selected ? 'ring-2 ring-primary shadow-lg' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold h-8 text-sm"
              placeholder="Title"
            />
          ) : (
            <CardTitle className="text-sm font-medium leading-none truncate pr-4">
              {data.title || "Untitled"}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] text-xs resize-none"
              placeholder="Content..."
            />
          ) : (
            <p className="text-xs text-muted-foreground min-h-[20px] whitespace-pre-wrap break-words">
              {data.content || "No content"}
            </p>
          )}
        </CardContent>
        
        {/* Action Buttons */}
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button size="icon" variant="default" className="h-6 w-6 rounded-full" onClick={handleSave}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full" onClick={handleCancel}>
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full shadow-sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="destructive" className="h-6 w-6 rounded-full shadow-sm" onClick={handleDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </Card>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
