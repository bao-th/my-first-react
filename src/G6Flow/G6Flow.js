import React, { Component } from "react";
import G6 from "@antv/g6";
// import { GraphLayoutPredict } from "@antv/vis-predict-engine";
export class G6Flow extends Component {
  graph = null;
  constructor(props) {
    super(props);
    this.state = {
      data: props.data == null ? {} : props.data,
      width: props.width,
      height: props.height,
    };
  }
  transData(data) {
    /***处理节点 */
    if (data && data.nodes && data.nodes.length > 0) {
      data.nodes.forEach((item) => {
        if (item.nam && item.nam.length > 8) {
          item.label = item.nam.substring(0, 8) + "...";
        } else {
          item.label = item.nam;
        }
        // item.id = item.id;
        item.description = item.ann;
        switch (item.typ.toUpperCase()) {
          case "START":
            item.type = "rect";
            item.size = [320, 180];
            item.style = {
              stroke: "#237804",
              fill: "#73d13d",
              lineWidth: 0,
              radius: 50,
            };
            break;
          case "END":
            item.type = "rect";
            item.size = [320, 180];
            item.style = {
              stroke: "#CC0033",
              fill: "#FF0033",
              lineWidth: 0,
              radius: 50,
            };
            item.anchorPoints = [[0.5, 0]];
            break;
          case "TASK":
            // item.type = "rect";
            // item.size = [320, 120];
            // item.style = {
            //   stroke: "#003366",
            //   fill: "#99CCFF",
            //   lineWidth: 0,
            //   radius: 10,
            // };
            // break;
            if (item.nam && item.nam.length > 6) {
              item.label = item.nam.substring(0, 6) + "...";
            } else {
              item.label = item.nam;
            }
            item.label = "\ue639   " + item.label;
            item.labelCfg = {
              position: "center",
              style: {
                fill: "blue",
                fontFamily: "iconfont",
              },
            };
            item.type = "modelRect";
            item.size = [520, 220];
            item.style = {
              stroke: "#003366",
              fill: "#99CCFF",
              lineWidth: 0,
              radius: 50,
            };

            item.preRect = {
              show: false,
              fill: "#003366",
              width: 10,
            };
            item.logoIcon = {
              show: false,
            };
            item.stateIcon = {
              show: false,
            };
            break;
          case "CTSGN":
            item.type = "ellipse";
            item.size = [520, 220];
            item.style = {
              stroke: "#CC6800",
              fill: "#FFFF00",
              lineWidth: 0,
              radius: 50,
            };
            break;
          case "IF":
            item.type = "diamond";
            item.size = [520, 220];
            item.style = {
              stroke: "#FF9999",
              fill: "#FFCCCC",
              lineWidth: 0,
              radius: 50,
            };
            break;
          case "SCRPT":
            item.type = "modelRect";
            item.size = [520, 220];
            item.style = {
              stroke: "#9966CC",
              fill: "#CCCCFF",
              lineWidth: 0,
              radius: 50,
            };
            if (item.nam && item.nam.length > 6) {
              item.label = item.nam.substring(0, 6) + "...";
            } else {
              item.label = item.nam;
            }
            item.label = "\ue77e   " + item.label;
            item.labelCfg = {
              position: "center",
              style: {
                fill: "#663333",
                fontFamily: "iconfont",
              },
            };

            item.preRect = {
              show: false,
              fill: "#003366",
              width: 10,
            };
            item.logoIcon = {
              show: false,
            };
            item.stateIcon = {
              show: false,
            };
            break;

          case "SRV":
            item.type = "modelRect";
            item.size = [520, 220];
            item.style = {
              stroke: "#669966",
              fill: "#66CC99",
              lineWidth: 0,
              radius: 50,
            };
            if (item.nam && item.nam.length > 6) {
              item.label = item.nam.substring(0, 6) + "...";
            } else {
              item.label = item.nam;
            }
            item.label = "\ue615   " + item.label;
            item.labelCfg = {
              position: "center",
              style: {
                fill: "#FFFFCC",
                fontFamily: "iconfont",
              },
            };

            item.preRect = {
              show: false,
              fill: "#003366",
              width: 10,
            };
            item.logoIcon = {
              show: false,
            };
            item.stateIcon = {
              show: false,
            };
            break;
          case "PARALLEL":
            // item.type = "diamond";
            // item.size = [220, 220];

            item.type = "ellipse";
            item.size = [520, 220];
            item.height = 80;
            item.style = {
              stroke: "#FF9966",
              fill: "#FFCC99",
              lineWidth: 0,
              radius: 10,
            };
            break;
          default:
            break;
        }
      });
    }
    /***处理线段 */
    if (data && data.edges && data.edges.length > 0) {
      data.edges.forEach((item) => {
        // if (!item.sourceAnchor) item.sourceAnchor = 2;
        // if (!item.targetAnchor) item.targetAnchor = 0;
        if (item.cndtFlg === false) {
          item.label = "N";
          item.style = {
            ...item.style,
            offset: 20, // 拐弯处距离节点最小距离
            radius: 10, // 拐弯处的圆角弧度，若不设置则为直角
            stroke: "#FF6666",
          };

          // if (!item.sourceAnchor) item.sourceAnchor = 0;
          // if (!item.targetAnchor) item.targetAnchor = 2;
        }
        if (item.cndtFlg === true) {
          item.label = "Y";
        }
        item.style = {
          ...item.style,
          lineWidth: 6,
        };
      });
    }
    return data;
  }
  componentDidMount() {
    let me = this;
    console.log(me.state.data);

    let data = this.transData(me.state.data);
    me.graph = new G6.Graph({
      // 省略其他配置
      layout: {
        // type: predictLayout.predictLayout,
        // nodeSize: 50,
        // preventOverlap: true,
        type: "dagre",
        rankdir: "TB", // 可选，默认为图的中心
        nodesep: 20, // 可选
        ranksep: 50, // 可选
        controlPoints: true, // 可选
      },
      fitView: "autoZoom",
      //fitView: true,
      container: "G6FlowPanel",
      width: me.state.width || 800,
      height: me.state.height || 800,
      defaultNode: {
        // 其他配置
        anchorPoints: [
          [0.5, 0],
          [1, 0.5],
          [0.5, 1],
          [0, 0.5],
        ],
        labelCfg: {
          style: {
            fontSize: 50,
          },
        },
      },
      defaultEdge: {
        // ... 其他属性
        type: "polyline",
        style: {
          stroke: "#722ed1",
          lineWidth: 2,
          // ... 其他样式属性,
          endArrow: {
            path: G6.Arrow.vee(10, 20, 0),
            d: 0,
          },
        },
        labelCfg: {
          refY: 20,
          refX: 20,
          style: {
            fontSize: 40,
          },
        },
      },
      modes: {
        default: [
          {
            type: "tooltip",
            formatText(model) {
              return model.nam;
            },
            offset: 10,
          },
        ],
      },
    });
    me.graph.data(data);
    me.graph.render();

    // GraphLayoutPredict.predict(data)
    //   .then((predictLayout, confidence) => {
    //     me.graph = new G6.Graph({
    //       // 省略其他配置
    //       layout: {
    //         // type: predictLayout.predictLayout,
    //         // nodeSize: 50,
    //         // preventOverlap: true,
    //         type: "dagre",
    //         rankdir: "TB", // 可选，默认为图的中心
    //         nodesep: 20, // 可选
    //         ranksep: 50, // 可选
    //         controlPoints: true, // 可选
    //       },
    //       fitView: "autoZoom",
    //       //fitView: true,
    //       container: "G6FlowPanel",
    //       width: me.state.width || 800,
    //       height: me.state.height || 800,
    //       defaultNode: {
    //         // 其他配置
    //         anchorPoints: [
    //           [0.5, 0],
    //           [1, 0.5],
    //           [0.5, 1],
    //           [0, 0.5],
    //         ],
    //         labelCfg: {
    //           style: {
    //             fontSize: 50,
    //           },
    //         },
    //       },
    //       defaultEdge: {
    //         // ... 其他属性
    //         type: "polyline",
    //         style: {
    //           stroke: "#722ed1",
    //           lineWidth: 2,
    //           // ... 其他样式属性,
    //           endArrow: {
    //             path: G6.Arrow.vee(10, 20, 0),
    //             d: 0,
    //           },
    //         },
    //         labelCfg: {
    //           refY: 20,
    //           refX: 20,
    //           style: {
    //             fontSize: 40,
    //           },
    //         },
    //       },
    //       modes: {
    //         default: [
    //           {
    //             type: "tooltip",
    //             formatText(model) {
    //               return model.nam;
    //             },
    //             offset: 10,
    //           },
    //         ],
    //       },
    //     });
    //     me.graph.data(data);
    //     me.graph.render();
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  }
  setData(data) {
    this.graph.data(data);
    this.graph.render();
  }
  componentWillUnmount() { }
  render() {
    return (
      <div
        id="G6FlowPanel"
        style={{
          width: this.state.width || 800,
          height: this.state.height || 800,
        }}
      ></div>
    );
  }
}

export default G6Flow;
