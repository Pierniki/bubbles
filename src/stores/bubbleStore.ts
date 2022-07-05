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

      const registerBubble = (bubble: ConfigBubble) => {
        bubblesList.push({
          ...bubble,
          bgImage: bubble.bgImage ?? null,
          children: bubble.children.map((child) => child.name)
        });
        bubble.children.forEach(registerBubble);
      };

      registerBubble(result);

      const bubblesDictionary = _.keyBy(bubblesList, 'name');
      set({ currentBubble: result.name, bubbles: bubblesDictionary });
    });

  return {
    subscribe,
    navigateToBubble: (name: string) => update((prev) => ({ ...prev, currentBubble: name })),
    getBubbleByName: (name: string): RegisteredBubble | null => get(store).bubbles[name],
    getCurrentBubble: (): RegisteredBubble | null => get(store).bubbles[get(store).currentBubble]
  };
}

export const bubbleStore = createBubbleStore();
