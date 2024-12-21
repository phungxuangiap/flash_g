export default function Desk(
  user_id,
  id,
  title,
  primary_color,
  new_card,
  inprogress_card,
  preview_card,
) {
  this.user_id = user_id;
  this._id = id;
  this.title = title;
  this.primary_color = primary_color;
  this.new_card = new_card;
  this.inprogress_card = inprogress_card;
  this.preview_card = preview_card;
}
