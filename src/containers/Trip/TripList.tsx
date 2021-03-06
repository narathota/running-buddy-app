import React, {memo} from "react";
import firebase from "firebase/app";
import Link from "next/link";

import {Button, ListGroup, ListGroupItem, Media} from "reactstrap";

import classNames from "./TripList.module.css";

import {PlaceHolder, Progress} from "../../components";
import {Trip} from "../../types";

interface TripItem extends Trip {
  uid: string;
}

interface TripListProps {
  trips: Array<TripItem>;
  loading: boolean;
  isFinished: boolean;
  handleFinished?: () => any;
}

const TripList: React.FC<TripListProps> = ({loading, trips}) => {
  const userId = firebase.auth().currentUser.uid;
  return (
      <div className={classNames.container}>
        <Progress loading={loading}/>
        <ListGroup>
          {trips.map(
              ({createdByUid, uid, name, participants, createdAt, rounds}) => {
                // add the creater
                let participantCount =
                    participants.length + (createdByUid !== userId ? 1 : 0);

                return (
                    <ListGroupItem>
                      <Media>
                        <Media className={classNames.mediaLeft} left>
                          {/*<FaRunning className={classNames.runningIcon} />*/}
                          <Link href={`/trip/${uid}`} key={`TripListItem-${uid}`}>
                            <Media
                                className={classNames.avatar}
                                object
                                src={
                                  createdByUid === userId
                                      ? "/trip.png"
                                      : "/trip-request.png"
                                }
                            />
                          </Link>
                        </Media>
                        <Media body>
                          <h5>{name}</h5>
                          <h6 className={classNames.emailH6}>
                            <b className={classNames.numberB}>{participantCount}</b> buddies have confirmed to join you
                            on this trip.
                          </h6>
                          <h6 className={classNames.emailH6}>
                            You went on this trip for <b className={classNames.numberB}>{rounds.length}</b> time(s)
                          </h6>
                          <h6 className={classNames.emailH6}>
                            Created at {createdAt.toLocaleString()}
                          </h6>
                        </Media>
                        {userId === createdByUid && (
                            <Media right>
                              <Link href={`/trip/${uid}?start=true`}>
                                <Button outline color="primary"
                                        className={classNames.lineButton}>Start Now</Button>
                              </Link>
                            </Media>
                        )}
                      </Media>
                    </ListGroupItem>
                );
              }
          )}
        </ListGroup>
        {!trips.length && <PlaceHolder>Lets plan a trip</PlaceHolder>}
      </div>
  );
};

export default memo(TripList);
