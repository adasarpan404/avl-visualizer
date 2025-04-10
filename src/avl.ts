export class Node {
  value: number;
  height: number = 1;
  left: Node | null = null;
  right: Node | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

export class AVLTree {
  root: Node | null = null;

  private height(node: Node | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: Node | null): number {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  private rightRotate(y: Node): Node {
    const x = y.left!;
    const T2 = x?.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
    x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
    return x;
  }

  private leftRotate(x: Node): Node {
    const y = x.right!;
    const T2 = y?.left;
    y.left = x;
    x.right = T2;
    x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
    y.height = 1 + Math.max(this.height(y.left), this.height(y.right));

    return y;
  }

  insert(value: number): void {
    this.root = this._insert(this.root, value);
  }

  private _insert(node: Node | null, value: number): Node {
    if (!node) return new Node(value);

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);
    if (balance > 1 && value < node.left!.value) return this.rightRotate(node);
    if (balance < -1 && value > node.right!.value) return this.leftRotate(node);
    if (balance > 1 && value > node.left!.value) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }
  delete(value: number): void {
    this.root = this._delete(this.root, value);
  }

  private _delete(node: Node | null, value: number): Node | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (!node.left || !node.right) {
        return node.left ?? node.right;
      }

      const successor = this._minValueNode(node.right);
      node.value = successor.value;
      node.right = this._delete(node.right, successor.value)
    }

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);
    if (balance > 1 && this.getBalance(node.left) >= 0) return this.rightRotate(node);
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && this.getBalance(node.right) <= 0) return this.leftRotate(node);
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  private _minValueNode(node: Node): Node {
    while (node.left) node = node.left;
    return node;
  }

  inorder(): number[] {
    const result: number[] = [];
    this._inorder(this.root, result);
    return result;
  }

  private _inorder(node: Node | null, result: number[]) {
    if (!node) return;
    this._inorder(node.left, result);
    result.push(node.value);
    this._inorder(node.right, result);
  }

  preorder(): number[] {
    const result: number[] = [];
    this._preorder(this.root, result);
    return result;
  }

  private _preorder(node: Node | null, result: number[]) {
    if (!node) return;
    result.push(node.value);
    this._preorder(node.left, result);
    this._preorder(node.right, result);
  }

  postorder(): number[] {
    const result: number[] = [];
    this._postorder(this.root, result);
    return result;
  }

  private _postorder(node: Node | null, result: Number[]) {
    if (!node) return;
    this._postorder(node.left, result);
    this._postorder(node.right, result);
    result.push(node.value);
  }

  searchPath(value: number): Node[] {
    const path: Node[] = [];
    let current = this.root;
    while (current) {
      path.push(current);
      if (value === current.value) break;
      current = value < current.value ? current.left : current.right;
    }
    return path;
  }


}