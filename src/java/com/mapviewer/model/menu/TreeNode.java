/*
* Copyright (c) 2013 Olmo Zavala
* Permission is hereby granted, free of charge, to any person obtaining a copy of 
* this software and associated documentation files (the "Software"), to deal in the 
* Software without restriction, including without limitation the rights to use, copy, 
* modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
* to permit persons to whom the Software is furnished to do so, subject to the following conditions: 
* The above copyright notice and this permission notice shall be included in all copies or substantial 
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/

package com.mapviewer.model.menu;

import java.util.ArrayList;

/**
 * This class represents a node of the tree. This node is used to generate a tree of menus for the user
 * It has the followinf properties: node(MenuEntry) that has the entries like ("Temp maxima","January")
 * is root to indicate if this is the root of the tree
 * isSelected indicates if the node is selected.
 * hasChildren to indicate if it has children *
 * @author Olmo Zavala Romero
 */
public class TreeNode {

	private boolean root;
	private boolean selected;
	private boolean hasChildren;
	private MenuEntry node;
	private ArrayList<TreeNode> children;

	/**
	 * Contructor to initialize variables
	 *
	 * @param {boolean}root boolean indicates if it is the root
	 * @param {MenuEntry}node MenuEntry group of menu entries that correspond to this node. 
	 * nodo
	 * @param {ArrayList<TreeNode>}childs ArrayList<TreeNode> children tree of this node. 
	 * @param {boolean} isSelected boolean tells if the user has selected this entry
	 *
	 */
	public TreeNode(boolean root, MenuEntry node, ArrayList<TreeNode> childs, boolean isSelected) {
		this.root = root;
		this.node = node;
		this.children = childs;
		this.selected = isSelected;
		if (this.children != null) {
			hasChildren = true;
		} else {
			hasChildren = false;
		}
	}

	/**
	 * Obtains the entrance of the menu that represent this node
	 *
	 * @return MenuEntry
	 */
	public MenuEntry getNode() {
		return node;
	}

	/**
	 * Assigns the entrys of the menu that represent this node. 
	 * 
	 *
	 * @param {MenuEntry} node MenuEntry
	 */
	public void setNode(MenuEntry node) {
		this.node = node;
	}

	public boolean isRoot() {
		return root;
	}

	public void setRoot(boolean root) {
		this.root = root;
	}

	/**
	 * Obtains the children tree of this node
	 *
	 * @return ArrayList<TreeNode>
	 */
	public ArrayList<TreeNode> getChilds() {
		return children;
	}

	/**
	 * make tree into an array
	 *
	 * @param child TreeNode
	 */
	public void addChild(TreeNode child) {
		if (this.children == null) {
			this.children = new ArrayList<TreeNode>();
		}
		this.children.add(child);
		hasChildren = true;
	}

	public boolean getHasChilds() {
		return hasChildren;
	}

	public void setHasChilds(boolean hasChilds) {
		this.hasChildren = hasChilds;
	}

	public boolean getSelected() {
		return selected;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public void setChilds(ArrayList<TreeNode> childs) {
		this.children = childs;
	}
}
