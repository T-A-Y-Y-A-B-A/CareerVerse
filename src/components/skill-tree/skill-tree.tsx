'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { SkillTreeNode, type SkillNodeData } from './skill-node'
import type { Skill, SkillStatus } from '@/lib/skills-data'

const NODE_TYPES = { skillNode: SkillTreeNode }

interface Props {
  skills:   Skill[]
  statuses: Record<string, SkillStatus>
  onUnlock: (skillId: string) => Promise<void>
}

const CATEGORY_EDGE_COLOR: Record<string, string> = {
  ai:        '#9333ea',
  fullstack: '#3b82f6',
  devops:    '#10b981',
}

export function SkillTree({ skills, statuses, onUnlock }: Props) {
  // Build React Flow nodes
  const initialNodes: Node<SkillNodeData>[] = useMemo(
    () =>
      skills.map((skill) => ({
        id:       skill.id,
        type:     'skillNode',
        position: skill.position,
        data: {
          skill,
          status:   statuses[skill.id] ?? 'locked',
          onUnlock,
        },
        // Prevent React Flow from allowing drags on locked nodes
        draggable: false,
      })),
    [skills, statuses, onUnlock]
  )

  // Build edges from skill prerequisites
  const initialEdges: Edge[] = useMemo(
    () =>
      skills.flatMap((skill) =>
        skill.requires.map((reqId) => {
          const parentUnlocked = statuses[reqId] === 'unlocked'
          const isTier2Edge = skill.tier === 2
          const isTier3Edge = skill.tier === 3

          let edgeColor = '#374151'
          let width = 1
          let opacity = 0.7
          let dashArray = undefined

          if (parentUnlocked) {
            if (isTier3Edge) {
              edgeColor = '#a855f7' // Violet for Tier 3 connections
              width = 4
              opacity = 1.0
            } else if (isTier2Edge) {
              edgeColor = '#fbbf24' // Yellow for Tier 2 connections
              width = 3
              opacity = 0.9
            } else {
              edgeColor = CATEGORY_EDGE_COLOR[skill.category]
              width = 2
              opacity = 0.9
            }
          } else {
            if (isTier3Edge) {
              edgeColor = '#581c87' // Dark purple for locked Tier 3 connections
              dashArray = '3,3'
              opacity = 0.35
            } else if (isTier2Edge) {
              edgeColor = '#78350f' // Dark amber for locked Tier 2 connections
              dashArray = '4,4'
              opacity = 0.4
            } else {
              opacity = statuses[reqId] === 'locked' ? 0.3 : 0.7
            }
          }

          return {
            id:           `${reqId}->${skill.id}`,
            source:       reqId,
            target:       skill.id,
            type:         'smoothstep',
            animated:     parentUnlocked,
            style: {
              stroke:      edgeColor,
              strokeWidth: width,
              opacity:     opacity,
              strokeDasharray: dashArray,
            },
            markerEnd: {
              type:  MarkerType.ArrowClosed,
              color: edgeColor,
            },
          }
        })
      ),
    [skills, statuses]
  )

  // Find the nodes to focus on initially (e.g., currently available nodes)
  const targetNodes = useMemo(() => {
    const availableNodes = initialNodes.filter(n => statuses[n.id] === 'available')
    if (availableNodes.length > 0) return availableNodes

    const unlockedNodes = initialNodes.filter(n => statuses[n.id] === 'unlocked')
    if (unlockedNodes.length > 0) {
      const maxY = Math.max(...unlockedNodes.map(n => n.position.y))
      return unlockedNodes.filter(n => n.position.y === maxY)
    }

    const minY = Math.min(...initialNodes.map(n => n.position.y))
    return initialNodes.filter(n => n.position.y === minY)
  }, [initialNodes, statuses])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3, nodes: targetNodes, maxZoom: 1.0 }}
        minZoom={0.3}
        maxZoom={1.5}
        panOnScroll={true}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="currentColor"
          className="text-muted-foreground/20"
        />
        <Controls className="!bg-background !border-border !shadow-none" />
      </ReactFlow>
    </div>
  )
}
