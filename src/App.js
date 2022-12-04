import "./styles.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useCallback, useState } from "react";

function Painel({ children, id }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...provided.droppableProps.style,
              minHeight: "200px"
            }}
          >
            {id}
            {children}
          </div>
        );
      }}
    </Droppable>
  );
}

function Layer({ children: item, index }) {
  return (
    <Draggable draggableId={item} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              background: "red",
              height: "50px",
              display: "flex",
              margin: "5px 0",
              justifyContent: "center"
            }}
          >
            <p>{item}</p>
          </div>
        );
      }}
    </Draggable>
  );
}

function getPainel(painels, local) {
  const sourceIndex = painels.reduce(
    (acc, crt) => {
      if (crt.name === local.droppableId) {
        acc.index = acc.searchIndex + 1;
      }

      return { ...acc, searchIndex: acc.searchIndex + 1 };
    },
    { index: -1, searchIndex: -1 }
  ).index;
  return sourceIndex;
}

const reorder = (list, source, destination) => {
  const result = Array.from(list);
  const sourceIndex = getPainel(list, source, destination);
  const destinationIndex = getPainel(list, destination);

  const [removed] = result[sourceIndex].layers.splice(source.index, 1);
  console.log({ removed, layer: result[destinationIndex].layers[removed] });
  if (removed) {
    result[destinationIndex].layers.splice(destination.index, 0, removed);
  }

  return result;
};

export default function App() {
  const [items, setItems] = useState([
    { name: "inMap", layers: ["1"] },
    { name: "outMap", layers: ["2", "3"] }
  ]);
  const dragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      setItems(reorder(items, result.source, result.destination));
      console.log(result);
    },
    [items]
  );
  return (
    <div className="App">
      <DragDropContext onDragEnd={dragEnd}>
        {items.map((painel) => (
          <Painel id={painel.name}>
            {painel.layers.map((item, index) => {
              return (
                <Layer
                  key={item}
                  index={index}
                >{`${painel.name}-${item}`}</Layer>
              );
            })}
          </Painel>
        ))}
      </DragDropContext>
    </div>
  );
}
