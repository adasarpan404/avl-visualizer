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

function drawTree() {
  treeContainer.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "500");
  if (avl.root) drawNode(svg, avl.root, window.innerWidth / 2, 50, window.innerWidth / 4);
  treeContainer.appendChild(svg);

  const inOrderOutput = document.getElementById("inOrderOutput")!;
  inOrderOutput.innerHTML = `<strong>Inorder:</strong> [${avl.inorder().join(", ")}]`;

  const preOrderOutput = document.getElementById("preOrderOutput")!;
  preOrderOutput.innerHTML = `<strong>Preorder:</strong> [${avl.preorder().join(", ")}]`;

  const postOrderOutput = document.getElementById("postOrderOutput")!;
  postOrderOutput.innerHTML = `<strong>Preorder:</strong> [${avl.postorder().join(", ")}]`;
}


function drawNode(svg: SVGSVGElement, node: Node, x: number, y: number, offset: number) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", "#4caf50");
  svg.appendChild(circle);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x.toString());
  text.setAttribute("y", (y + 5).toString());
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.textContent = node.value.toString();
  svg.appendChild(text);

  if (node.left) {
    drawLine(svg, x, y, x - offset, y + 70);
    drawNode(svg, node.left, x - offset, y + 70, offset / 2);
  }

  if (node.right) {
    drawLine(svg, x, y, x + offset, y + 70);
    drawNode(svg, node.right, x + offset, y + 70, offset / 2);
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
