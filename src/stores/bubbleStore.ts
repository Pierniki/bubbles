import { writable } from 'svelte/store';

interface Node {
  name: string;
  color: string;
  children: string[];
}

interface ConfigLink {
  source: string;
  target: string;
}

interface Link {
  source: {
    name: string;
    index: number;
  };
  target: {
    name: string;
    index: number;
  };
}

interface BubbleStore {
  nodes: Node[];
  links: Link[];
}

const createBubbleStore = () => {
  const store = writable<BubbleStore>({ nodes: [], links: [] });
  const { subscribe } = store;

  fetchNodes()
    .then((nodes) => {
      store.update((prev) => ({ ...prev, nodes }));
      return nodes;
    })
    .then((nodes) => {
      fetchLinks().then((configLinks) => {
        const links = configLinks.map((link) => ({
          source: { index: nodes.findIndex((node) => node.name === link.source), name: link.source },
          target: { index: nodes.findIndex((node) => node.name === link.target), name: link.target }
        }));
        store.update((prev) => ({ ...prev, links }));
      });
    });
  return { subscribe };
};

const fetchNodes = (): Promise<Node[]> => fetch('nodes.json').then((res) => res.json());
const fetchLinks = (): Promise<ConfigLink[]> => fetch('stories.json').then((res) => res.json());

export const bubbleStore = createBubbleStore();
