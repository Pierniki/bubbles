import { writable } from 'svelte/store';

export interface Node {
  name: string;
  color: string;
}

export interface Link {
  source: string;
  target: string;
}

interface BubbleStore {
  nodes: Node[];
  links: Link[];
}

const createBubbleStore = () => {
  const store = writable<BubbleStore>({ nodes: [], links: [] });
  const { subscribe } = store;

  fetchNodes().then((nodes) => {
    const normalizedNodes = nodes.map((node) => ({ ...node, name: node.name.toLocaleLowerCase() }));
    store.update((prev) => ({ ...prev, nodes: normalizedNodes }));
  });
  fetchLinks().then((configLinks) => {
    const links = configLinks.map((link) => ({
      ...link,
      source: link.source.toLocaleLowerCase(),
      target: link.target.toLocaleLowerCase()
    }));
    store.update((prev) => ({ ...prev, links }));
  });
  return { subscribe };
};

const fetchNodes = (): Promise<Node[]> => fetch('nodes.json').then((res) => res.json());
const fetchLinks = (): Promise<Link[]> => fetch('stories.json').then((res) => res.json());

export const bubbleStore = createBubbleStore();
