import React from "react";
import MapboxGl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from 'mapbox-gl-draw-circle';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import './Map.scss'



class Map extends React.Component {
  state = {
    map: null,
    draw: null,
    showPanel: false,
  }
  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1Ijoic2VsYWRhbnRpIiwiYSI6ImNrMmZsNDRzeTBqbWgzb3BiZ2dtN2xldzYifQ.p35N5Dy5ygo1BbUxH_blFQ';

    let map = new MapboxGl.Map({
      container: this.mapDiv,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [36.7394723, -1.2514369],
      zoom: 14
    });

    let draw = new MapboxDraw({
      userProperties: true,
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        draw_circle: CircleMode,
        drag_circle: DragCircleMode,
        direct_select: DirectMode,
        simple_select: SimpleSelectMode,
        draw_rectangle: DrawRectangle
      },
      controls: {
        trash: true
      }
    });

    this.setState({
      ...this.state,
      draw, map
    })
    map.on('load', () => {
      map.addControl(draw);
      map.on("draw.create", this.getCoordinates);
      map.on("draw.update", this.getCoordinates);
      map.on("draw.delete", this.getCoordinates);
    })
  }

  getCoordinates = () => {
    const { draw } = this.state;
    let data = draw.getAll()
    console.log(data)

  }

  changeMode = (mode) => () => {
    const { draw } = this.state;
    draw.changeMode(mode, { initialRadiusInKm: 0.5 });
    console.log(draw.options)
  }

  toglePanel = () => {
    this.setState(prevState  => ({
      ...prevState,
      showPanel: !prevState.showPanel
    }))
  }

  render() {
    const {showPanel} =this.state;
    return (
      <div>
        <button className="circle" onClick={this.changeMode('draw_circle')}>circle</button>
        <button className="polygon" onClick={this.changeMode('draw_polygon')}>Polygon</button>
        <button className="bounding-box" onClick={this.changeMode('draw_rectangle')}>bounding box</button>
        <button className="panel" onClick={this.toglePanel}>{showPanel ? 'close panel' : 'show panel'}</button>
        <div ref={e => (this.mapDiv = e)} className="map"></div>
        <div className={showPanel ? 'show-panel' : 'hide-panel'}>
f
        </div>
      </div>
    );
  }
}

export default Map;
