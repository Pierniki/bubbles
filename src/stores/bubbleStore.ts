import _ from 'lodash';
import { get, writable } from 'svelte/store';

export interface ConfigBubble {
  name: string;
  color: string;
  weight: number;
  position: {
    w: number;
    h: number;
  };
  bgImage?: string;
  children: ConfigBubble[];
}

export interface RegisteredBubble {
  parent: string | null;
  name: string;
  color: string;
  weight: number;
  position: {
    w: number;
    h: number;
  };
  bgImage: string | null;
  children: string[];
}

interface BubbleStore {
  currentBubble: string;
  bubbles: _.Dictionary<RegisteredBubble>;
}

function createBubbleStore() {
  const store = writable<BubbleStore>({ currentBubble: '', bubbles: {} });
  const { subscribe, set, update } = store;

  fetch('nodes.json')
    .then((res) => res.json())
    .then((result: ConfigBubble) => {
      let bubblesList: RegisteredBubble[] = [];

      const registerBubble = (bubble: ConfigBubble, parent: string | null) => {
        bubblesList.push({
          ...bubble,
          parent,
          bgImage: bubble.bgImage ?? null,
          children: bubble.children.map((child) => child.name)
        });
        bubble.children.forEach((bub) => registerBubble(bub, bubble.name));
      };

      registerBubble(result, null);

      const bubblesDictionary = _.keyBy(bubblesList, 'name');
      set({ currentBubble: window.location.hash.split('#')[1] ?? result.name, bubbles: bubblesDictionary });
    });

  return {
    subscribe,
    navigateToBubble: (name: string) => update((prev) => ({ ...prev, currentBubble: name })),
    getBubbleByName: (name: string): RegisteredBubble | null => get(store).bubbles[name],
    getCurrentBubble: (): RegisteredBubble | null => get(store).bubbles[get(store).currentBubble],
    getBubbleBreadcrumbs: (name: string, breadcrumbs: string[] = []) => {
      const dig = (name: string, breadcrumbs: string[] = []): string[] => {
        const bubbles = get(store).bubbles;
        const bubble = bubbles[name];
        if (!bubble) return breadcrumbs;
        if (bubble.parent) return dig(bubble.parent, [...breadcrumbs, bubble.name]);
        return [...breadcrumbs, bubble.name];
      };
      return dig(name, breadcrumbs);
    }
  };
}

export const bubbleStore = createBubbleStore();
