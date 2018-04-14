"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

import {MenuItem, Form, Well, Col, Row, Grid, Panel, Modal, InputGroup, 
  HelpBlock, FormControl, FormGroup, Image, ControlLabel, SplitButton, DropdownButton} from 'react-bootstrap'
import {Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, 
  CardImgOverlay, CardDeck, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap'


class RoomCard extends React.Component {

  constructor(props){
      super(props)
      this.state = {
        rooms: null,
        gameErrMsg: "",
        game: "選擇遊戲",
        show: false,
        labelPopoverOpen: false,
        isActive: this.props.roomInfo!==null ? this.props.roomInfo.isActive : null,
        nTeam: "選擇隊伍上限",
        teams: [
          {
            name: "team1",
            note: "note1"
          },
          {
            name: "team2",
            note: "note2"
          },
          {
            name: "team3",
            note: "note3"
          },
        ]
      }

      this.open  = this.open.bind(this)
      this.close = this.close.bind(this)
      this.enter = this.enter.bind(this)
      this.closeGame = this.closeGame.bind(this)
      this.handleCreate = this.handleCreate.bind(this)
      this.handleSelectGame = this.handleSelectGame.bind(this)
      this.handleTeamSelect = this.handleTeamSelect.bind(this)
      this.toggleLabelPopover = this.toggleLabelPopover.bind(this)
      this.resetValidationState = this.resetValidationState.bind(this)     
      this.handleSelectNTeam = this.handleSelectNTeam.bind(this) 
  }

  close(){

      this.setState({
        show: false,
        game: "選擇遊戲",
        gameErrMsg: ""
      })
  }

  open(){
      this.setState({show: true})
  }

  toggleLabelPopover(){
      this.setState({labelPopoverOpen: !this.state.labelPopoverOpen})
  }


  closeGame(){
      let comfirmMsg = "關閉遊戲後將無法重啟，確定關閉遊戲？"
      if(confirm(comfirmMsg)){
          this.setState({isActive: false})
          let roomInfo = new FormData()
          roomInfo.append("label", this.props.roomInfo.label)
          roomInfo.append("isActive", false)
          axios.post("http://localhost:8000/updateRoom/", roomInfo)
            .then((response) => {
                console.log(response)
            })
            .catch((response) => {
                console.log(response)
            })
      }
  }

  resetValidationState(type){
    
      switch(type){
        case 'teacher':
            this.setState({
              teacherVal: null,
              teacherErrMsg: ""
            })
            break
        case 'label':
            this.setState({
              labelVal: null,
              labelErrMsg: ""
            })
            break
        default:
            console.log("error type:", type)
            break
      }
    }

  
    validate(/*teacher, label, */game){
      
      this.setState({
        // teacherVal: teacher === "" ? 'error' : null,
        // labelVal: label === "" ? 'error' : null,
        // teacherErrMsg: teacher === "" ? '請輸入名稱' : "",
        // labelErrMsg: label === "" ? '請輸入標籤' : "",
        gameErrMsg: game === "選擇遊戲" ? "請選擇遊戲" : ""
      })


      return /*teacher === "" || label === "" || */game === "選擇遊戲"
  }

  handleSelectGame(eventKey){
      this.setState({
        gameErrMsg: "",
        game: eventKey
      })
  }

  handleSelectNTeam(eventKey){
    this.setState({
      nTeam: eventKey
    })
}

  handleTeamSelect(eventKey, e){
      console.log(e.target)
      // e.target.preventDefault()
  }

  handleCreate(event){
    // store room in database
    console.log(this)
    
    let teacher = this.props.teacher.name
    let game = this.state.game
    let nTeam = this.state.nTeam

    if(this.validate(game)){
        return
    }

    let roomInfo = new FormData()
    roomInfo.append("teacher", teacher)
    roomInfo.append("game", game)
    roomInfo.append("nTeam", nTeam)

    axios.post("http://localhost:8000/new/", roomInfo)
      .then((response) => {
        console.log(response)
        // if(response.data === 'label already exists.'){
        //     this.setState({
        //       labelVal: "error",
        //       labelErrMsg: response.data,
        //     })
        //     return
        // }
        roomInfo.append("label", response.data)
        roomInfo.append("isActive", true)
        this.props.handleUpdateRooms(roomInfo)
        this.close()
      })
      .catch((err) => {
          console.log(err)
      })
    
  }

  enter(){

      let label = this.props.roomInfo.label
      this.props.history.push({
        pathname: 'http://localhost:8000/'+label
      });
      // axios.get("http://localhost:8000/"+label+"/")
      //   .then((response) => {
      //       console.log(response)
      //   })
      //   .catch((err) =>{
      //       console.log(err)
      //   })
  }

  render(){

      console.log("render", "RoomCard")
      const teamsMenuItem = this.state.teams.map(function(team, i){
        return (
          <MenuItem eventKey={i} key={i}>
            <span className="glyphicon glyphicon-remove"></span>
            {team.name}
          </MenuItem>
        )
      })
      const room = (this.props.roomInfo) ? (
        <div className="room-card">
          <Card>
            <button type="button" id={"popover-"+this.props.roomInfo.label} className="btn btn-default btn-circle btn-room-remove" onClick={this.toggleLabelPopover}>
              <span style={{"fontSize":"17px","right":"3px","top":"-2px"}} className="glyphicon glyphicon-info-sign"></span>
            </button>
            <Popover placement="auto" isOpen={this.state.labelPopoverOpen} target={"popover-"+this.props.roomInfo.label} toggle={this.toggleLabelPopover}>
              <PopoverHeader style={{"fontSize":"15px", "textAlign":"center"}}>遊戲資訊</PopoverHeader>
              <PopoverBody>
                <ul style={{"padding":"0px 20px"}}>
                  <li>隊伍上限: {this.props.roomInfo.nTeam}</li>
                  <li>金鑰: {this.props.roomInfo.label}</li>
                </ul>
              </PopoverBody>
            </Popover>
            
            <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
            <CardBody>
              <CardTitle style={{'fontWeight':'bold'}}>{this.props.roomInfo.game}</CardTitle>
              <DropdownButton style={{"marginBottom":"5px"}} title="隊伍" 
                id="team-dropdown" disabled={!this.state.isActive} onSelect={this.handleTeamSelect}>
                {teamsMenuItem}
              </DropdownButton>
              <CardText><Button className={this.state.isActive ? "btn-success" : "btn-default"} onClick={this.closeGame} disabled={!this.state.isActive}>{this.state.isActive ? "遊戲進行中" : "遊戲已結束"}</Button></CardText>
              <Button className="center-align btn-primary" disabled={!this.state.isActive} onClick={this.enter}>進入遊戲</Button>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="room-card">
        <Card>
          <CardBody>
            <div className="center">
              <button onClick={this.open} type="button" className="btn btn-default btn-circle btn-room-create"><i className="glyphicon glyphicon-plus"></i></button>
            </div>
          </CardBody>
        </Card>
        </div>
      )

      // const gameList = getGames()
      return(
        <div>
          {room}
          { <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>建立遊戲</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup validationState={this.state.gameVal}>
                  <SplitButton componentClass={InputGroup.Button} id="split-button-basic" ref="gameBtn" title={this.state.game} onSelect={this.handleSelectGame} bsStyle="primary">
                    {/* {gameList} */}
                    <MenuItem ref="game1" eventKey="game1">game1</MenuItem>
                    <MenuItem ref="game2" eventKey="game2">game2</MenuItem>
                    <MenuItem ref="game3" eventKey="game3">game3</MenuItem>
                  </SplitButton>
                  {this.state.gameErrMsg !== "" && <HelpBlock><font size="14px" color="red">{this.state.gameErrMsg}</font></HelpBlock>}
                </FormGroup>
                <FormGroup >
                  <SplitButton componentClass={InputGroup.Button} id="split-button-num" ref="btnNTeam" title={this.state.nTeam} onSelect={this.handleSelectNTeam} bsStyle="primary">
                    <MenuItem ref="oneTeams" eventKey="1">1</MenuItem>
                    <MenuItem ref="twoTeams" eventKey="2">2</MenuItem>
                    <MenuItem ref="threeTeams" eventKey="3">3</MenuItem>
                    <MenuItem ref="fourTeams" eventKey="4">4</MenuItem>
                    <MenuItem ref="fiveTeams" eventKey="5">5</MenuItem>
                  </SplitButton>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleCreate}>建立</Button>
              <Button onClick={this.close}>取消</Button>
            </Modal.Footer>
          </Modal> }
        </div>
      )
  }
}

export default withRouter(RoomCard)