/* eslint-disable no-console */
import { getPublishDate } from '@finsweet/ts-utils';

export const insertAfter = (referenceNode: Node, newNode: Node): void => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

export const createElementFromHTML = (htmlString: string): Node => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
};
