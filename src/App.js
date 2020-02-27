import React from 'react';
// import logo from './logo.svg';
import './App.css';
import out from './out.json'
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TreeModel from 'tree-model'
import { uniqueId, last, defaultTo } from 'lodash'

class App extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    const tree = new TreeModel({ childrenPropertyName: 'childs'})
    const root = tree.parse(out)
    root.walk(function rcTreeModelCompatible(node) {
      const {
        name,
        label: { en },
        childs,
      } = node.model

      node.model.key = name
      node.model.title = en
      node.model.children = childs
      node.model.childs = null
    })
    this.root = new TreeModel().parse(root.model)

    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      treeData: root.model,
    };
  }
  onExpand = (...args) => {
    console.log('onExpand', ...args);
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;

    if (this.tree) {
      console.log(
        'Selected DOM node:',
        selectedKeys.map(key => ReactDOM.findDOMNode(this.tree.domTreeNodes[key])),
      );
    }
  };
  setTreeRef = (tree) => {
    this.tree = tree;
  };
  onDoubleClick = (event, node) => {
    console.log('double click')
    const internalTree = this.tree
    internalTree.onNodeExpand(event, node)
  }
  onAdd = () => {
    const [selectedKey] = this.tree.state.selectedKeys
    if(!selectedKey) {
      return
    }
    const node = this.root.first(({ model }) => model.key === selectedKey)
    const name = `foo${uniqueId()}`
    node.addChild(new TreeModel().parse({key: name, title: name, children: []}))
    this.setState({ treeData: this.root.model })
  }
  onRemove = () => {
    const [selectedKey] = this.tree.state.selectedKeys
    if(!selectedKey) {
      return
    }
    const node = this.root.first(({ model }) => model.key === selectedKey)
    this.tree.setState({ selectedKeys: [] })
    node.drop()
    this.setState({ treeData: this.root.model })
  }
  onDrop = ({ node, dragNodesKeys, dropToGap, dropPosition, ...rest }) => {
    const sourceKey = last(dragNodesKeys)
    const { name: destinationKey } = node.props
    const sourceNode = this.root.first(({ model }) => model.key === sourceKey)
    const destinationNode = this.root.first(({ model }) => model.key === destinationKey)
    const sourceNodeClone = new TreeModel().parse(sourceNode.model)
    const dropPositionNormalized = dropPosition < 0 ? 0: dropPosition
    if(dropToGap) {
      const parent = defaultTo(destinationNode.parent, this.root)
      parent.addChildAtIndex(sourceNodeClone, dropPositionNormalized)
    }
    else {
      destinationNode.addChild(sourceNodeClone)
    }
    sourceNode.drop()
    this.setState({ treeData: this.root.model })
  }
  onGoUp = () => {
    const [selectedKey] = this.tree.state.selectedKeys
    if(!selectedKey) {
      return
    }
    const node = this.root.first(({ model }) => model.key === selectedKey)
    const newIndex = node.getIndex() - 1
    if(newIndex < 0) {
      return
    }
    node.setIndex(newIndex)
    this.setState({ treeData: this.root.model })
  }
  onGoDown = () => {
    const [selectedKey] = this.tree.state.selectedKeys
    if(!selectedKey) {
      return
    }
    const node = this.root.first(({ model }) => model.key === selectedKey)
    const newIndex = node.getIndex() + 1
    if(newIndex >= node.parent.model.children.length) {
      return
    }
    node.setIndex(newIndex)
    this.setState({ treeData: this.root.model })
  }
  render() {
    return (
      <div style={{ margin: '0 20px' }}>
        <h2>Check on Click TreeNode</h2>
        <Tree
          className="myCls"
          showLine
          // checkable
          selectable={ true }
          draggable
          // defaultExpandAll
          defaultExpandedKeys={[out.name]}
          onExpand={this.onExpand}
          onDrop={this.onDrop}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          // onCheck={this.onCheck}
          treeData={[this.state.treeData]}
          onDoubleClick={this.onDoubleClick}
          ref={this.setTreeRef}
        />
        <button onClick={this.onAdd}>Add</button>
        <button onClick={this.onRemove}>Remove</button>
        <button onClick={this.onGoUp}>Up</button>
        <button onClick={this.onGoDown}>Down</button>
      </div>
    );
  }
}

export default App;
