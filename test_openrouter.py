import openai
client = openai.OpenAI(
    api_key='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',
    base_url='https://openrouter.ai/api/v1'
)
resp = client.chat.completions.create(
    model='inclusionai/ling-2.6-1t:free',
    messages=[{'role':'user','content':'Say hi in 5 words'}],
    max_tokens=20
)
print('Reply:', resp.choices[0].message.content)
print('Model:', resp.model)
