"use client"

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
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

// Initial data without callbacks
const initialData = [
  { id: '1', type: 'card', position: { x: 250, y: 250 }, data: { title: 'Welcome', content: 'Double click to edit.\nDrag to move.\nClick + to add new cards.' } },
];

export default function Board() {
  // specific type for our nodes
  const [nodes, setNodes, onNodesChange] = useNodesState<CardNode>([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Handlers for node interactions
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

  // Function to hydrate nodes with callbacks
  // We need this because we can't easily serialize functions, 
  // so when we create nodes we attach these live handlers.
  const createNodeData = useCallback((data: Partial<CardNodeData> = {}) => {
    return {
      title: data.title || '',
      content: data.content || '',
      onUpdate: handleNodeUpdate,
      onDelete: handleNodeDelete,
    };
  }, [handleNodeUpdate, handleNodeDelete]);

  // Initialize nodes on mount
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
    <div className="w-full h-screen bg-background">
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
        <Background color="#999" gap={25} size={1} />
        <Controls />
        <MiniMap />
        
        <Panel position="top-right" className="p-4">
          <Button onClick={addCard} className="shadow-lg gap-2">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
