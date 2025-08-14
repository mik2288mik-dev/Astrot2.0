import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface PersonalityPromptData {
  sun: { sign: string; house: number }
  moon: { sign: string; house: number }
  ascendant: { sign: string }
  planets: Array<{ name: string; sign: string; house: number }>
  name: string
}

export async function generatePersonalInterpretation(data: PersonalityPromptData): Promise<string> {
  const prompt = `
Ты — опытный астролог, который выступает в роли лучшего друга пользователя ${data.name}. 
Твоя задача — объяснить его натальную карту понятным и дружелюбным языком на русском языке. 

Избегай сложного жаргона, говори так, словно общаешься с близким приятелем: с юмором, теплом, но честно. 
В конце каждого раздела дай небольшой совет или напутствие, как использовать эти особенности характера.

Данные рождения ${data.name}:
- Солнце в ${data.sun.sign} в ${data.sun.house} доме
- Луна в ${data.moon.sign} в ${data.moon.house} доме  
- Асцендент в ${data.ascendant.sign}
- Другие планеты: ${data.planets.map((p) => `${p.name} в ${p.sign} в ${p.house} доме`).join(", ")}

Структура ответа:
1. Краткий общий портрет личности (2-3 предложения)
2. Основные черты характера (на основе Солнца и Асцендента)
3. Эмоциональный мир (на основе Луны)
4. Отношения и общение
5. Потенциал развития и рекомендации

Пиши тепло, с пониманием, иногда с легким юмором. Не повторяй названия знаков слишком часто, 
акцентируй внимание на смысле для жизни человека.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || "Не удалось сгенерировать интерпретацию"
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "Временно недоступно. Попробуйте позже."
  }
}

export async function generateDailyHoroscope(data: PersonalityPromptData): Promise<string> {
  const prompt = `
Создай персональный ежедневный гороскоп для ${data.name} на сегодня.
Учти его натальную карту: Солнце в ${data.sun.sign}, Луна в ${data.moon.sign}, Асцендент в ${data.ascendant.sign}.

Стиль: дружелюбный, мотивирующий, с легким юмором. 2-3 предложения максимум.
Дай конкретный совет на день, связанный с его астрологическими особенностями.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
    })

    return completion.choices[0]?.message?.content || "Отличный день для новых начинаний!"
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "Звезды сегодня благосклонны к тебе!"
  }
}

export async function generateCompatibilityReport(
  person1: PersonalityPromptData,
  person2: PersonalityPromptData,
): Promise<string> {
  const prompt = `
Создай отчет о совместимости между ${person1.name} и ${person2.name}.

${person1.name}: Солнце в ${person1.sun.sign}, Луна в ${person1.moon.sign}, Асцендент в ${person1.ascendant.sign}
${person2.name}: Солнце в ${person2.sun.sign}, Луна в ${person2.moon.sign}, Асцендент в ${person2.ascendant.sign}

Стиль: дружелюбный, честный, с юмором. Расскажи о сильных сторонах союза и потенциальных вызовах.
Дай практические советы для гармоничных отношений. 4-5 предложений.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || "Вы отлично дополняете друг друга!"
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "Ваши звезды говорят о прекрасной совместимости!"
  }
}
