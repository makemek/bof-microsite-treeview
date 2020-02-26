import React from 'react';
// import logo from './logo.svg';
import './App.css';
import out from './out.json'
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TreeModel from 'tree-model'


const treeData =
  { key: '0-0', title: 'parent 1', x:1, y:2, children:
    [
      { key: '0-0-0', title: 'parent 1-1', children:
        [
          { key: '0-0-0-0', title: 'parent 1-1-0' },
        ],
      },
      { key: '0-0-1', title: 'parent 1-2', children:
          [
            { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
            { key: '0-0-1-1', title: 'parent 1-2-1' },
          ],
      },
    ],
  }

const tree = new TreeModel({ childrenPropertyName: 'childs'})
const root = tree.parse(out)
root.walk(node => {
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

console.log(root.model)

class App extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  static defaultProps = {
    keys: ['0-0-0-0'],
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
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
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };
  onDel = (e) => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };
  setTreeRef = (tree) => {
    this.tree = tree;
  };
  render() {
    const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: 'blue' }} onClick={this.onEdit}>Edit</span>&nbsp;
        <label onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>
        &nbsp;
        <span style={{ color: '#EB0000' }} onClick={this.onDel}>Delete</span>
      </span>
    );

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
          onDrop={info => console.log(info)}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={[root.model]}
        />
      </div>
    );
  }
}


// function App() {
//   console.log(out)
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
