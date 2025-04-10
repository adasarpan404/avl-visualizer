import './style.css';
import { AVLTree, Node } from './avl';

const avl = new AVLTree();
const input = document.getElementById("valueInput") as HTMLInputElement;
const treeContainer = document.getElementById("treeContainer")!;

const insertValue = () => {
  const value = parseInt(input.value);
  if (!isNaN(value)) {
    avl.insert(value);
    input.value = '';
    drawTree();
  }
};

const deleteValue = () => {
  const value = parseInt(input.value);
  if (!isNaN(value)) {
    avl.delete(value);
    input.value = '';
    drawTree();
  }
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    insertValue();
  }
});

(window as any).insertValue = insertValue;
(window as any).deleteValue = deleteValue;

function drawTree(highlightPath: Set<number> = new Set(), foundValue: number | null = null) {
  treeContainer.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "500");

  if (avl.root)
    drawNode(svg, avl.root, window.innerWidth / 2, 50, window.innerWidth / 4, highlightPath, foundValue);

  treeContainer.appendChild(svg);

  const inOrderOutput = document.getElementById("inOrderOutput")!;
  inOrderOutput.innerHTML = `<strong>Inorder:</strong> [${avl.inorder().join(", ")}]`;

  const preOrderOutput = document.getElementById("preOrderOutput")!;
  preOrderOutput.innerHTML = `<strong>Postorder:</strong> [${avl.preorder().join(", ")}]`;

  const postOrderOutput = document.getElementById("postOrderOutput")!;
  postOrderOutput.innerHTML = `<strong>Postorder:</strong> [${avl.postorder().join(", ")}]`;
}

(window as any).searchValue = async () => {
  const value = parseInt(input.value);
  const resultDiv = document.getElementById("searchResult")!;
  if (isNaN(value)) return;

  const path = avl.searchPath(value);
  const highlightSet = new Set<number>();

  for (let i = 0; i < path.length; i++) {
    highlightSet.add(path[i].value);
    drawTree(highlightSet, null);
    await new Promise((resolve) => setTimeout(resolve, 500)); // animation delay
  }

  const found = path.length > 0 && path[path.length - 1].value === value;
  drawTree(highlightSet, found ? value : null);

  resultDiv.innerHTML = found
    ? `<span style="color: green;">✅ ${value} found in the tree.</span>`
    : `<span style="color: red;">❌ ${value} not found in the tree.</span>`;
};


function drawNode(
  svg: SVGSVGElement,
  node: Node,
  x: number,
  y: number,
  dx: number,
  highlightPath: Set<number> = new Set(),
  foundValue: number | null = null
) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "node");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", "#fff");
  circle.setAttribute("stroke", "#000");

  if (highlightPath.has(node.value)) {
    circle.classList.add("visited");
  }

  if (foundValue === node.value) {
    circle.classList.remove("visited");
    circle.classList.add("found");
  }

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x.toString());
  text.setAttribute("y", (y + 5).toString());
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "16");
  text.textContent = node.value.toString();

  group.appendChild(circle);
  group.appendChild(text);
  svg.appendChild(group);

  if (node.left) {
    drawLine(svg, x, y, x - dx, y + 80);
    drawNode(svg, node.left, x - dx, y + 80, dx / 2, highlightPath, foundValue);
  }
  if (node.right) {
    drawLine(svg, x, y, x + dx, y + 80);
    drawNode(svg, node.right, x + dx, y + 80, dx / 2, highlightPath, foundValue);
  }
}


function drawLine(svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y1.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y2.toString());
  line.setAttribute("stroke", "#555");
  svg.appendChild(line);
}

