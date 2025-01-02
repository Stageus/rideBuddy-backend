const Errorhandler = (req, res, next, err) => {
  if (err == 400) {
    res.status(400).send({ message: '정규표현식에 맞지 않음' });
  } else if ((err = 401)) {
    res.status(401).send({ message: '올바른 token이 아님' });
  } else if ((err = 403)) {
    res.status(403).send({ message: '' });
  } else if ((err = 404)) {
    res.status(404).send({ message: 'Not Fonud Error' });
  } else if ((err = 409)) {
    res.status(409).send({ message: '이미 사용중' });
  }
};
