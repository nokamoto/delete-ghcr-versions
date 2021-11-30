FROM busybox:latest

ARG VERSION

RUN echo $VERSION > /version
RUN date >> /version
