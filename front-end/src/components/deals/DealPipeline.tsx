// src/components/deals/DealPipeline.tsx
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Deal, DealStage } from "@/types/deal";
import { Client } from "@/types/client";
import { Card } from "@/components/ui/Card";

// First, we define the interface that matches how the component is being used
interface DealPipelineProps {
  deals: Deal[];
  clients: Client[];
  onDragEnd: (result: any) => void; // We'll type this more strictly in a moment
}

// We define our stage configuration to maintain consistent styling and labels
const STAGES: Record<DealStage, { title: string; color: string }> = {
  INITIAL_CONTACT: {
    title: "Primeiro Contato",
    color: "bg-blue-100/50 hover:bg-blue-100/70",
  },
  NEGOTIATION: {
    title: "Em Negociação",
    color: "bg-yellow-100/50 hover:bg-yellow-100/70",
  },
  PROPOSAL: {
    title: "Proposta Enviada",
    color: "bg-purple-100/50 hover:bg-purple-100/70",
  },
  CLOSED_WON: {
    title: "Ganhos",
    color: "bg-green-100/50 hover:bg-green-100/70",
  },
  CLOSED_LOST: {
    title: "Perdidos",
    color: "bg-red-100/50 hover:bg-red-100/70",
  },
};

export function DealPipeline({ deals, clients, onDragEnd }: DealPipelineProps) {
  // We organize deals by their stages for easier rendering
  const dealsByStage = deals.reduce(
    (acc, deal) => {
      if (!acc[deal.stage]) {
        acc[deal.stage] = [];
      }
      acc[deal.stage].push(deal);
      return acc;
    },
    {} as Record<DealStage, Deal[]>
  );

  // We calculate the total value for each stage
  const calculateStageTotal = (stageDeals: Deal[]) => {
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(STAGES).map(([stage, config]) => (
          <Droppable key={stage} droppableId={stage}>
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                rounded-lg p-4 min-h-[500px]
                ${config.color}
                ${snapshot.isDraggingOver ? "ring-2 ring-primary-500" : ""}
                transition-colors duration-200
              `}
              >
                {/* Stage Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">{config.title}</h3>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      calculateStageTotal(
                        dealsByStage[stage as DealStage] || []
                      )
                    )}
                  </span>
                </div>

                {/* Deals in this stage */}
                <div className="space-y-3">
                  {dealsByStage[stage as DealStage]?.map((deal, index) => {
                    const client = clients.find((c) => c.id === deal.clientId);

                    return (
                      <Draggable
                        key={deal.id}
                        draggableId={deal.id}
                        index={index}
                      >
                        {(
                          provided: DraggableProvided,
                          snapshot: DraggableStateSnapshot
                        ) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                      p-4 bg-white
                      ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary-500" : "shadow-sm"}
                      transition-all duration-200
                    `}
                          >
                            <h4 className="font-medium text-gray-900">
                              {deal.title}
                            </h4>
                            {client && (
                              <p className="text-sm text-gray-500 mt-1">
                                {client.name}
                              </p>
                            )}
                            <p className="text-sm font-medium text-gray-900 mt-2">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(deal.value)}
                            </p>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
