export default function Card(
  id,
  desk_id,
  status,
  level,
  last_preview,
  vocab,
  description,
  sentence,
  vocab_audio,
  sentence_audio,
) {
  this.id = id;
  this.desk_id = desk_id;
  this.status = status;
  this.level = level;
  this.last_preview = last_preview;
  this.vocab = vocab;
  this.description = description;
  this.sentence = sentence;
  this.vocab_audio = vocab_audio;
  this.sentence_audio = sentence_audio;
}
