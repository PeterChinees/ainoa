import React, { useState, useEffect, useCallback } from "react";
import { EmotionProps, Emotion } from "./emotions_interfaces";
import { Form, TextArea, Button } from "semantic-ui-react";

export const Emotions: React.FC<EmotionProps> = () => {
	const [text, setText] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [predictions, setPredictions] = useState([]);

	const getPredictions = useCallback(async () => {
		if (isSending) return;

		setIsSending(true);

		const textToSend: string = text;

		if (textToSend !== "") {
			const response: Response = await fetch("/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(text)
			});

			if (response.ok) {
				response.json().then((preds: any[]) => {
					setPredictions(preds);
				});
			}

			setText("");
			setIsSending(false);
		}
	}, [isSending, predictions, text]);

	return (
		<>
			<Form>
				<Form.Field>
					<TextArea
						value={text}
						onChange={e => {
							setText(e.currentTarget.value);
						}}></TextArea>
				</Form.Field>
				<Form.Field>
					<Button disabled={isSending} onClick={async () => getPredictions()}>
						Submit
					</Button>
				</Form.Field>
			</Form>
			<div style={{ marginTop: 12, marginBottom: 12, fontFamily: "Arial" }}>
				<h5>Predictions: </h5>
				{predictions.map((p: any[], index: number) => {
					let label: string = "";
					switch (p[0]) {
						case Emotion.ANGER:
							label = "Anger";
							break;
						case Emotion.ANTICIPATION:
							label = "Anticipation";
							break;
						case Emotion.DISGUST:
							label = "Disgust";
							break;
						case Emotion.FEAR:
							label = "Fear";
							break;
						case Emotion.JOY:
							label = "Joy";
							break;
						case Emotion.LOVE:
							label = "Love";
							break;
						case Emotion.OPTIMISM:
							label = "Optimism";
							break;
						case Emotion.PESSIMISM:
							label = "Pessimism";
							break;
						case Emotion.SADNESS:
							label = "Sadness";
							break;
						case Emotion.SURPRISE:
							label = "Surprise";
							break;
						case Emotion.TRUST:
							label = "Trust";
							break;
					}
					return (
						<p key={p[0]}>
							{label} -> {Math.round(p[1] * 100 + Number.EPSILON) / 100}
						</p>
					);
				})}
			</div>
		</>
	);
};
