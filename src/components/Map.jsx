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
    coordinates: [],
    isMapLoaded: false,
    mode: '',
    data: null
  }
  componentDidMount() {
    // get token from mapbox
    MapboxGl.accessToken = process.env.REACT_APP_MAP_TOKEN;

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
      this.setState({
        isMapLoaded: true
      })
      map.addControl(draw);
      map.on("draw.create", this.getCoordinates);
      map.on("draw.update", this.getCoordinates);
    })
  }

  /**
   * get th coordinates of the drawn object 
   */
  getCoordinates = () => {
    const { draw } = this.state;

    let data = draw.getAll();
    this.setState({
      ...this.state,
      data,
      mode: draw.getMode().split('_')[1]
    })
  }

  /**
   * change the current draw mode 
   */
  changeMode = (modeStr) => () => {
    const { draw } = this.state;
    
    let data = draw.getAll()

    if (data.features.length !== 0) {
      draw.deleteAll();
    }
    draw.changeMode(modeStr, { initialRadiusInKm: 0.5 });
  }

  /**
   * togle the coordinate panel
   */
  toglePanel = () => {
    this.setState(prevState => ({
      ...prevState,
      showPanel: !prevState.showPanel
    }))
  }

  /**
   * return the respective coordinates 
   */
  renderCoordinates = () => {
    const {mode, data} = this.state;
    if (mode === 'circle' || mode === 'select'){
      let radius = data.features[0].properties.radiusInKm;
      let coordinates = data.features[0].properties.center;
      return (
         <p> Item selected is {mode} with  radius {radius}km and coordinates {coordinates.join(',')} </p>   
      )
    }
   if (mode === 'polygon' || mode === 'select'){
      let coordinates = data.features[0].geometry.coordinates[0].join(',');
      return (
        <p>Items selected is {mode} with coordinates {coordinates}</p>
      )   
    }
  if (mode === 'rectangle' || mode === 'select'){
    let coordinates = data.features[0].geometry.coordinates[0]
    const topLeft = coordinates[0].join(',')
    const bottomRight = coordinates[3].join(',')
    return (
      <p>Item selected is bounding box with top left coordinates - {topLeft} and bottom right coordinates {bottomRight}</p>
    )
  }
  }
  render() {
    const { showPanel, isMapLoaded } = this.state;
    return (
      <React.Fragment>
        {isMapLoaded
          &&
          <div>
            <button className="circle" onClick={this.changeMode('draw_circle')}>circle</button>
            <button className="polygon" onClick={this.changeMode('draw_polygon')}>Polygon</button>
            <button className="bounding-box" onClick={this.changeMode('draw_rectangle')}>bounding box</button>
            <button className="panel" onClick={this.toglePanel}>{showPanel ? 'close coordinates' : 'show coordinates'}</button>
          </div>
        }
        <div ref={e => (this.mapDiv = e)} className="map"></div>
        <div className={showPanel ? 'show-panel' : 'hide-panel'}>
          {this.renderCoordinates()}
        </div>
      </React.Fragment>
    );
  }
}

export default Map;
