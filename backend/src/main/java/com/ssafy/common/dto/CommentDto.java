package com.ssafy.common.dto;

import com.ssafy.common.entity.Board;
import com.ssafy.common.entity.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CommentDto {

    private Long commentSeq;
    private String content;
    private String ip;
    private Integer isChild;
    private String nickName;
    private String password;
    private Long parentId;
    private Integer isDeleted;
    private LocalDateTime deletedDateTime;
    private Board board;

    public Comment toEntity(){
        Comment comment = Comment.builder()
                .commentSeq(commentSeq)
                .ip(ip)
                .content(content)
                .isChild(isChild)
                .nickName(nickName)
                .password(password)
                .parentId(parentId)
                .isDeleted(isDeleted)
                .board(board)
                .deletedDateTime(deletedDateTime)
                .build();

        return comment;
    }

}
