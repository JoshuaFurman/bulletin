"use client"

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNode, CardNodeData, CardNode } from './CustomNode';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const nodeTypes = {
  card: CustomNode,
};

const initialData = [
  { id: '1', type: 'card', position: { x: 250, y: 250 }, data: { title: 'Welcome', content: 'Double click to edit.\nDrag to move.\nClick + to add new cards.' } },
];

export default function Board() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CardNode>([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleNodeUpdate = useCallback((id: string, newData: { title: string; content: string }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleNodeDelete = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [setNodes]);

  const createNodeData = useCallback((data: Partial<CardNodeData> = {}) => {
    return {
      title: data.title || '',
      content: data.content || '',
      onUpdate: handleNodeUpdate,
      onDelete: handleNodeDelete,
    };
  }, [handleNodeUpdate, handleNodeDelete]);

  React.useEffect(() => {
    setNodes(initialData.map(n => ({
      ...n,
      data: {
        ...n.data,
        onUpdate: handleNodeUpdate,
        onDelete: handleNodeDelete,
      }
    })));
  }, [handleNodeUpdate, handleNodeDelete, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addCard = useCallback(() => {
    const id = `node-${Date.now()}`;
    const newNode: CardNode = {
      id,
      type: 'card',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: createNodeData({
        title: 'New Card',
        content: 'Type something here...',
      }),
    };
    setNodes((nds) => nds.concat(newNode));
  }, [createNodeData, setNodes]);

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      {/* Header / Frame */}
      <div className="h-16 md:h-20 bg-primary shadow-xl z-50 flex items-center justify-center border-b-8 border-primary-foreground/20 relative shrink-0">
         <div className="border-4 border-dashed border-primary-foreground/30 px-4 py-1 md:px-8 md:py-2 rounded-lg bg-primary-foreground/5 transform -rotate-1 backdrop-blur-sm">
           <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground tracking-widest uppercase drop-shadow-md font-sans truncate max-w-[80vw]">
             Bulletin Board
           </h1>
         </div>
      </div>

      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Background 
            color="currentColor" 
            className="text-foreground/10" 
            gap={25} 
            size={2} 
            variant={BackgroundVariant.Dots} 
          />
          <Controls className="bg-card text-card-foreground border-2 border-primary/20 rounded-lg shadow-md" />
          <MiniMap className="border-2 border-primary/20 rounded-lg shadow-md bg-card" maskColor="rgba(0,0,0,0.1)" nodeColor="var(--primary)" />
          
          <Panel position="top-right" className="p-4 md:p-6 top-16 md:top-0">
            <Button 
              onClick={addCard} 
              className="h-12 px-6 md:h-14 md:px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)] transition-all border-2 border-primary-foreground/20 rounded-xl text-lg md:text-xl font-bold rotate-2"
            >
              <Plus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
              Add Note
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
