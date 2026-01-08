export type NodeCategory = 'client' | 'server' | 'database' | 'storage' | 'worker' | 'external' | 'general';

export interface DiagramNode {
  id: string;
  label: string;
  subLabel?: string;
  category: NodeCategory;
  layer: number;
  icon?: string;
  color?: string;
}

export interface DiagramLink {
  source: string;
  target: string;
}

export interface DiagramData {
  title: string;
  nodes: DiagramNode[];
  links: DiagramLink[];
}
