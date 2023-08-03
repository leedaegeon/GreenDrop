import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import trashcan from "../../assets/trashcan.png";
import { toggleIsOpenComment, getCommentList } from "../../store";
import classes from "./BalanceGameCommentModal.module.css";

function BalanceGameCommentModal({
  boardSeq,
  setShowCheckModal,
  setConfirm,
  setConfirmModalData,
  update,
  setUpdate,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://i9b103.p.ssafy.io:8000/api/comment/" + boardSeq)
      .then((response) => {
        console.log("응답", response.data);

        const fetchedCommentList = [...response.data];

        // console.log("패치 된 카드 리스트", fetchedCardList);
        dispatch(getCommentList(fetchedCommentList));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, update]);
  const commentObj = useSelector((state) => {
    return state.commentObj;
  });

  const [isWriteChildComment, setIsWriteChildComment] = useState(false);

  const [parentCommentNumber, setParentCommentNumber] = useState("");
  // const [parentUser, setParentUser] = useState("")

  const isOpenComment = useSelector((state) => {
    return state.isOpenComment;
  });
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  const [parentNum, setParentNum] = useState("");
  // const [commentNum, setCommentNum] = useState("");
  // console.log(new Date().toISOString().slice(0, -5))
  function timePassed(date) {
    let timeValue = new Date(date);
    let today = new Date();
    console.log("오늘:", today);
    console.log("작성시", timeValue);
    // 분을 나타냄
    let time = (today - timeValue) / 1000 / 60;

    if (time < 1) {
      return "방금 전";
    }
    if (time < 60) {
      return parseInt(time) + "분 전";
    }
    time = time / 60; // 시간
    if (time < 24) {
      return parseInt(time) + "시간 전";
    }
    time = time / 24;
    if (time < 7) {
      return parseInt(time) + "일 전";
    }
    return `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
  }

  // console.log(boardSeq);
  //부모 댓글 등록
  function handleCommentRegist() {
    const newComment = {
      nickName: nickname,
      password: password,
      content: comment,
    };
    if (comment.length === 0) {
      setConfirm(true);
      setShowCheckModal(true);
      setConfirmModalData({
        confirmTitle: "댓글을 작성해주세요",
        confirmCategory: "comment",
        confirmType: "regist",
        confirmAction: "실패",
      });
    } else {
      axios
        .post(
          "http://i9b103.p.ssafy.io:8000/api/comment/regist/parent/" + boardSeq,
          JSON.stringify(newComment),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          },
        )
        .then(() => {
          setComment("");
          setUpdate(update + 1);
          setNickname("");
          setPassword("");
          setComment("");
        })
        .catch((error) => {
          console.error(newComment);
          console.error(error);
          //댓글 등록 실패
          // setShowCheckModal이거를 null이 아니게 바꿔줘야함
          setConfirm(true);
          setShowCheckModal(true);
          setConfirmModalData({
            confirmTitle: "댓글 등록 실패",
            confirmCategory: "comment",
            confirmType: "regist",
            confirmAction: "실패",
          });
        });
    }
  }

  // 대댓글 등록
  function handleChildCommentRegist() {
    // console.log(parentNum);
    const newComment = {
      nickName: nickname,
      password: password,
      content: comment,
    };
    console.log(newComment);
    if (comment.length === 0) {
      setConfirm(true);
      setShowCheckModal(true);
      setConfirmModalData({
        confirmTitle: "답글을 작성해주세요",
        confirmCategory: "comment",
        confirmType: "regist",
        confirmAction: "실패",
      });
    } else {
      axios
        .post(
          "http://i9b103.p.ssafy.io:8000/api/comment/regist/child/" + parentNum,
          JSON.stringify(newComment),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          },
        )
        .then(() => {
          setComment("");
          setUpdate(update + 1);

          setNickname("");
          setPassword("");
          setComment("");
        })
        .catch((error) => {
          //대댓글 등록 실패
          setConfirm(true);
          // setShowCheckModal이거를 null이 아니게 바꿔줘야함
          setShowCheckModal(true);
          setConfirmModalData({
            confirmTitle: "답글 등록 실패",
            confirmCategory: "childcomment",
            confirmType: "regist",
            confirmAction: "실패",
          });
        });
    }
  }

  return (
    <div>
      <div
        className={classes.backdrop}
        onClick={() => {
          dispatch(toggleIsOpenComment(isOpenComment.isOpenComment));
          dispatch(getCommentList([]));
        }}
      >
        <div
          className={classes.comment_outer_box}
          onClick={(e) => {
            setIsWriteChildComment(false);
            // setParentUser("")
            e.stopPropagation();
          }}
        >
          <div className={classes.comment_inner_box}>
            <div className={classes.comment_top}>
              <h2>댓글</h2>
            </div>

            <div className={classes.comment_middle}>
              {commentObj.map(({ comment, comments }, idx) => {
                return (
                  <div key={idx} className={classes.comment_area}>
                    <div className={classes.parent_comment}>
                      <div className={classes.comment_area_top}>
                        <div className={classes.cooment_area_top_left}>
                          <span className={classes.name_area}>
                            {comment.nickName} &nbsp;
                          </span>
                          <span>{timePassed(comment.createdDate)}</span>
                        </div>

                        <img
                          src={trashcan}
                          alt=""
                          className={classes.trashcan_img}
                          onClick={() => {
                            console.log("삭제");
                            setShowCheckModal({
                              commentSeq: comment.commentSeq,
                              title: "본인이 작성한 댓글만 삭제할 수 있습니다.",
                              category: "comment",
                              type: "delete",
                              action: "삭제하기",
                            });
                            // setCommentNum(comment.commentSeq);
                          }}
                        />
                      </div>
                      <div className={classes.comment_area_middle}>
                        {comment.content}
                      </div>
                      <div
                        className={classes.comment_area_bottom}
                        onClick={(e) => {
                          e.stopPropagation();

                          console.log("답글달기");
                          setIsWriteChildComment(true);
                          // setParentUser(comment.nickName)
                          setParentCommentNumber(comment.commentSeq);
                          setParentNum(comment.commentSeq);
                          console.log(parentNum);
                        }}
                      >
                        답글달기
                      </div>
                    </div>
                    <div className={classes.child_comment_area}>
                      {comments.map((childComment, idx2) => {
                        return (
                          <div key={idx2} className={classes.child_comment}>
                            <div className={classes.comment_area_top}>
                              <div className={classes.coment_area_top_left}>
                                <span className={classes.name_area}>
                                  {childComment.nickName} &nbsp;
                                </span>
                                <span>
                                  {timePassed(childComment.createdDate)}
                                </span>
                              </div>

                              <img
                                src={trashcan}
                                alt=""
                                className={classes.trashcan_img}
                                onClick={() => {
                                  console.log("삭제");
                                  setShowCheckModal({
                                    commentSeq: childComment.commentSeq,
                                    title:
                                      "본인이 작성한 댓글만 삭제할 수 있습니다.",
                                    category: "comment",
                                    type: "delete",
                                    action: "삭제하기",
                                  });
                                  // setCommentNum(childComment.commentSeq);
                                }}
                              />
                              {/* </div> */}
                            </div>
                            <div className={classes.comment_area_middle}>
                              {childComment.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {isWriteChildComment ? (
              <div
                className={classes.comment_bottom}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={classes.user_info_input_area}>
                  <input
                    type="text"
                    className={classes.password_input}
                    placeholder="닉네임을 입력하세요."
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.password_input_area}>
                  <input
                    type="password"
                    className={classes.password_input}
                    placeholder="비밀번호를 입력하세요."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.comment_input_area}>
                  <input
                    type="text"
                    className={classes.input_tag}
                    // value={parentUser || ` `}
                    placeholder="답글을 등록하세요"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />

                  <button
                    className={classes.regist_btn}
                    onClick={() => {
                      // console.log(parentCommentNumber);
                      //대댓글 등록
                      handleChildCommentRegist();
                    }}
                  >
                    등록
                  </button>
                </div>
              </div>
            ) : (
              <div className={classes.comment_bottom}>
                <div className={classes.user_info_input_area}>
                  <input
                    type="text"
                    className={classes.password_input}
                    placeholder="닉네임을 입력하세요."
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.password_input_area}>
                  <input
                    type="password"
                    className={classes.password_input}
                    placeholder="비밀번호를 입력하세요."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.comment_input_area}>
                  <input
                    type="text"
                    className={classes.input_tag}
                    placeholder="댓글을 등록하세요"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />

                  <button
                    className={classes.regist_btn}
                    onClick={() => {
                      console.log(parentCommentNumber);
                      //댓글 등록
                      handleCommentRegist();
                    }}
                  >
                    등록
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BalanceGameCommentModal;
